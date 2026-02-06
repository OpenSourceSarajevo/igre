# Igre - Multi-Game Platform

A platform for Bosnian language puzzle games.

## Structure

- `/client/` - Frontend application (React + TypeScript + Vite)
- (Future) `/api/` - Backend API services
- (Future) `/shared/` - Shared types and utilities

## Games

### Konekcije
Connections-style word puzzle game in Bosnian. Find groups of four words that share a common category.

- Daily puzzles with four difficulty levels
- Completion tracking via localStorage
- Archive of historical puzzles
- Dev mode for testing future puzzles

## Development

See [client/README.md](client/README.md) for frontend development instructions.

## Repository Structure

This is a monorepo prepared for multiple games and future API integration. The current structure supports:
- Configurable game branding via environment variables
- Game-specific data organization
- Placeholder API service layer
- Shared configuration system
