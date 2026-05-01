#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-unused-vars */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTAINER_NAME = 'pg_db_local';
const DB_NAME = 'english_lessons';
const DB_USER = 'postgres';
const DB_PASSWORD = 'password';
const DB_PORT = 5432;
const POSTGRES_VERSION = '17.9';

function log(message) {
  console.log(`[PostgreSQL Manager] ${message}`);
}

function logError(message) {
  console.error(`[PostgreSQL Manager ERROR] ${message}`);
}

function execCommand(command, options = {}) {
  try {
    const result = execSync(command, {
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options,
    });
    return result;
  } catch (error) {
    if (options.silent) {
      throw error;
    }
    process.exit(1);
  }
}

function checkDocker() {
  try {
    execCommand('docker --version', { silent: true });
    return true;
  } catch (error) {
    logError('Docker is not installed or not running');
    return false;
  }
}

function checkContainerExists() {
  try {
    const result = execCommand(
      `docker ps -a --filter "name=${CONTAINER_NAME}" --format "{{.Names}}"`,
      { silent: true },
    );
    return result.trim() === CONTAINER_NAME;
  } catch (error) {
    return false;
  }
}

function checkContainerRunning() {
  try {
    const result = execCommand(
      `docker ps --filter "name=${CONTAINER_NAME}" --format "{{.Names}}"`,
      { silent: true },
    );
    return result.trim() === CONTAINER_NAME;
  } catch (error) {
    return false;
  }
}

function checkImageExists() {
  try {
    const result = execCommand(
      `docker images --format "{{.Repository}}:{{.Tag}}" | grep "^postgres:${POSTGRES_VERSION}$"`,
      { silent: true },
    );
    return result.trim() === `postgres:${POSTGRES_VERSION}`;
  } catch (error) {
    return false;
  }
}

function pullImage() {
  log(`Pulling PostgreSQL ${POSTGRES_VERSION} image...`);
  try {
    execCommand(`docker pull postgres:${POSTGRES_VERSION}`);
    log('PostgreSQL image pulled successfully');
  } catch (error) {
    logError('Failed to pull PostgreSQL image');
    throw error;
  }
}

function createContainer() {
  log('Checking for existing PostgreSQL container...');

  // Check if the existing container is available
  try {
    const result = execCommand(
      `docker ps -a --filter "name=${CONTAINER_NAME}" --format "{{.Names}}"`,
      { silent: true },
    );
    if (result.trim() === CONTAINER_NAME) {
      log('Found existing container, starting it...');
      execCommand(`docker start ${CONTAINER_NAME}`);
      log('PostgreSQL container started successfully');
      return;
    }
  } catch (error) {
    // Container doesn't exist, continue to creation
  }

  log(
    'Existing container not found. This script requires the container "' +
      CONTAINER_NAME +
      '" to be running.',
  );
  logError(
    'Please start the existing container manually or ensure it is available.',
  );
  throw new Error('Required container not found');
}

function startContainer() {
  log('Starting PostgreSQL container...');
  try {
    execCommand(`docker start ${CONTAINER_NAME}`);
    log('PostgreSQL container started successfully');
  } catch (error) {
    logError('Failed to start PostgreSQL container');
    throw error;
  }
}

function stopContainer() {
  log('Stopping PostgreSQL container...');
  try {
    execCommand(`docker stop ${CONTAINER_NAME}`);
    log('PostgreSQL container stopped successfully');
  } catch (error) {
    logError('Failed to stop PostgreSQL container');
    throw error;
  }
}

function removeContainer() {
  log('Removing PostgreSQL container...');
  try {
    execCommand(`docker rm ${CONTAINER_NAME}`);
    log('PostgreSQL container removed successfully');
  } catch (error) {
    logError('Failed to remove PostgreSQL container');
    throw error;
  }
}

function waitForDatabase() {
  log('Waiting for database to be ready...');

  return new Promise((resolve, reject) => {
    const maxAttempts = 2;
    let attempts = 0;

    const checkConnection = () => {
      attempts++;
      try {
        execCommand(
          `docker exec ${CONTAINER_NAME} psql -U ${DB_USER} -d ${DB_NAME} -c "SELECT 'ready' as status;"`,
          { silent: true },
        );
        log('Database is ready!');
        resolve();
      } catch (error) {
        if (attempts >= maxAttempts) {
          logError('Database failed to become ready after maximum attempts');
          reject(new Error('Database connection timeout'));
          return;
        }
        log(`Waiting for database... (${attempts}/${maxAttempts})`);
        setTimeout(checkConnection, 2000);
      }
    };

    setTimeout(checkConnection, 5000); // Wait 5 seconds before first check
  });
}

function showStatus() {
  log('Checking PostgreSQL status...');

  if (!checkDocker()) {
    log('Docker: Not available');
    return;
  }

  log('Docker: Available');

  if (!checkImageExists()) {
    log('PostgreSQL Image: Not downloaded');
    return;
  }

  log('PostgreSQL Image: Available');

  if (!checkContainerExists()) {
    log('Container: Not created');
    return;
  }

  log('Container: Created');

  if (checkContainerRunning()) {
    log('Container: Running');

    try {
      const result = execCommand(
        `docker exec ${CONTAINER_NAME} psql -U ${DB_USER} -d ${DB_NAME} -c "SELECT 'connected' as status;"`,
        { silent: true },
      );
      log('Database: Connected and ready');
    } catch (error) {
      log('Database: Container running but not ready');
    }
  } else {
    log('Container: Stopped');
  }
}

async function startDatabase() {
  log('Starting PostgreSQL database...');

  if (!checkDocker()) {
    logError('Docker is not available. Please install Docker first.');
    process.exit(1);
  }

  if (!checkContainerExists()) {
    log('Container not found, creating...');
    createContainer();
  } else if (!checkContainerRunning()) {
    log('Container found but stopped, starting...');
    startContainer();
  } else {
    log('Container is already running');
  }

  log(`PostgreSQL is running on localhost:${DB_PORT}`);
  log(`Database: ${DB_NAME}`);
  log(`User: ${DB_USER}`);
}

function stopDatabase() {
  log('Stopping PostgreSQL database...');

  if (!checkContainerRunning()) {
    log('Container is not running');
    return;
  }

  stopContainer();
}

function resetDatabase() {
  log('Resetting PostgreSQL database...');

  if (checkContainerRunning()) {
    stopContainer();
  }

  if (checkContainerExists()) {
    removeContainer();
  }

  // Remove the volume to completely reset
  try {
    execCommand('docker compose down --volumes');
    log('Database volume removed');
  } catch (error) {
    log('Failed to remove volume (may not exist)');
  }

  // Create fresh container
  createContainer();

  // Wait for database to be ready
  waitForDatabase()
    .then(() => {
      log('Database reset complete');
    })
    .catch((error) => {
      logError('Database reset failed');
      process.exit(1);
    });
}

function showLogs() {
  log('Showing PostgreSQL logs...');

  if (!checkContainerRunning()) {
    logError('Container is not running');
    process.exit(1);
  }

  try {
    execCommand(`docker logs -f ${CONTAINER_NAME}`);
  } catch (error) {
    logError('Failed to show logs');
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
PostgreSQL Database Manager

Usage: node scripts/manage-postgres.js <command>

Commands:
  start     Start the PostgreSQL database (creates container if needed)
  stop      Stop the PostgreSQL database
  restart   Restart the PostgreSQL database
  reset     Reset the PostgreSQL database (delete all data)
  status    Show current database status
  logs      Show database logs
  help      Show this help message

Examples:
  node scripts/manage-postgres.js start
  node scripts/manage-postgres.js status
  node scripts/manage-postgres.js reset

Environment:
  Container: ${CONTAINER_NAME}
  Database: ${DB_NAME}
  User: ${DB_USER}
  Port: ${DB_PORT}
  Version: ${POSTGRES_VERSION}
`);
}

// Main execution
const command = process.argv[2];

switch (command) {
  case 'start':
    startDatabase();
    break;
  case 'stop':
    stopDatabase();
    break;
  case 'restart':
    stopDatabase();
    setTimeout(() => startDatabase(), 2000);
    break;
  case 'reset':
    resetDatabase();
    break;
  case 'status':
    showStatus();
    break;
  case 'logs':
    showLogs();
    break;
  case 'help':
  default:
    showHelp();
    break;
}
