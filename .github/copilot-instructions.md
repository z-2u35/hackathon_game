# AI Coding Agent Instructions for hackathon_game

## Project Overview
**The Lost Lantern: Echoes of Asteros** is a Roguelike Horror / Text-Adventure / Puzzle Web3 game (v3.0). Players assume the role of "The Seeker" (copy #10,492) exploring the Asteros dungeon with a lantern that "consumes" emotions. The project combines a Next.js + zkLogin frontend with a Sui Move blockchain backend for Dynamic NFTs and Shared Objects.

## Architecture

### Core Blockchain Layer (`contract/`)
The Sui Move contract defines the game's on-chain logic:

**Primary Modules:**
- **`lantern.move`**: The main player character "Lantern" object with core game stats
  - `Lantern` struct: Tracks `sanity`, `oil`, `light_level`, and `is_alive` state
  - `new_game()`: Entry point creating a new Lantern NFT (mints player character)
  - `burn()`: Destructively ends a game (True Ending or failure)
  - `update_stats()`: Modifies game stats (called during gameplay)
  - **Key Pattern**: Oil depletion (`oil <= 0`) triggers death

- **`items.move`**: Game items system for inventory/trading
  - `GameItem` struct: Items with `name`, `description`, `rarity` (1-5 scale), and `power`
  - **Rarity Constants**: COMMON(1), RARE(2), EPIC(3), LEGENDARY(4), CURSED(5)
  - `mint()`: Create new items
  - `transfer_item()`: P2P trading (enables player-to-player transfers)
  - `burn()`: Destroy items (used for "Memory Pool" mechanic)

**Sub-package `lantern_protocol/`**: Empty template package for future protocol extensions. Contains scaffolding and test templates but no active logic yet.

### Smart Contract Patterns

1. **Ownership Model**: Objects are transferred directly to players using `transfer::transfer()` (Lantern) or `transfer::public_transfer()` (GameItem with `store` capability)
2. **Object Lifecycle**: Create via entry functions → modify stats during gameplay → destroy via `burn()` to clean up state
3. **No Shared Objects Yet**: Current implementation uses owned objects; shared objects likely planned for dungeon exploration mechanics
4. **Constants Define Boundaries**: MAX_SANITY, MAX_OIL, STARTING_LIGHT establish game rules directly in code

## Development Workflow

### Building the Contract
```bash
cd contract/
sui move build
```
- Entry point: `contract/Move.toml` (main package)
- Dependencies: Points to `framework/testnet` branch of Sui repository
- Address placeholders: Keep `lantern_protocol = "0x0"` until deployment; Sui CLI generates the actual address

### Testing
```bash
sui move test
```
- Test templates exist in `lantern_protocol/tests/lantern_protocol_tests.move` but are currently commented out
- Uncomment `#[test_only]` module and specific `#[test]` functions as tests are written
- Use `#[expected_failure]` for testing abort conditions

### Deployment Notes
- Package names defined in Move.toml (e.g., `name = "lantern_protocol"`)
- The main game contract in `sources/` is NOT packaged yet; it will be deployed to generate the actual package ID
- Dependencies must resolve before building (Sui framework testnet revision)

## Project-Specific Conventions

### Naming & Localization
- **Vietnamese Documentation**: Comments use Vietnamese for design notes (e.g., `// Chỉ số Tinh thần (0-100)` = "Sanity stat (0-100)")
- **English Code**: Move module and function names are English; preserve mixed language pattern in comments
- **Citation Format**: Documentation includes `[cite: LINE_NUMBERS]` references for cross-referencing design decisions

### Game Design Patterns
- **Death Condition**: Oil depletes → `is_alive = false`
- **Stat Bounds**: All stats clamped to 0-100 range
- **Item Rarity**: 5-tier system; CURSED (5) likely triggers special mechanics
- **True Ending**: Burning the Lantern object signals game completion (not game over)

### Module Structure
- Entry functions are the public API (`entry fun`)
- Core logic split by domain: `lantern.move` (character), `items.move` (inventory)
- Keep module dependencies minimal; they import only `sui::` and `std::` libraries

## Integration Points

### Frontend Connection (Next.js + zkLogin)
- **Expected Flow**: User logs in via zkLogin → Frontend calls `new_game()` → Lantern NFT transferred to user wallet → Gameplay updates stats and items
- **Transaction Signing**: All state mutations go through Move entry functions (frontend calls via Sui JSON-RPC)
- **NFT Display**: The Lantern and GameItems are owned objects; frontend reads from user's address via Sui explorer API

### Shared Objects & Future Scaling
- Current implementation: All objects are owned (transferred to player)
- **Next Phase**: Dungeon state (rooms, enemies, puzzles) likely uses shared objects for consensus between players
- **Pattern to Expect**: `#[key] #[store]` for items that can be in inventory, without `#[store]` for dungeon fixtures

## Common Tasks

### Adding a New Game Mechanic
1. Define the new struct in the appropriate `.move` file (or create a new module)
2. Add `entry` functions for player interaction
3. Update `update_stats()` if it affects core stats
4. Test with `sui move test` before committing
5. Update the comment documentation with design intent

### Fixing Game Balance
- Constants at the top of each module (`MAX_SANITY`, `MAX_OIL`, RARITY levels)
- Modify these to adjust difficulty/item power; re-test after changes

### Deploying to Testnet
1. Run `sui move build` to verify compilation
2. Use `sui client publish` to deploy the package
3. The CLI outputs the new package ID
4. Update frontend `.env` to reference the new package ID

## Resources
- Sui Move Docs: https://docs.sui.io/concepts/sui-move-concepts/conventions
- Project Repo: truong_dev branch (active development)
- Build Output: `contract/build/` (auto-generated; ignore in edits)
