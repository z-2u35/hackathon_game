module lantern_protocol::lantern {
    // Imports
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    // Constants
    const MAX_SANITY: u64 = 100;
    const MAX_OIL: u64 = 100;
    const STARTING_LIGHT: u64 = 50;

    // Object struct
    public struct Lantern has key, store {
        id: UID,
        sanity: u64,
        oil: u64,
        light_level: u64,
        is_alive: bool,
    }

    // Mint new lantern
    #[allow(lint(public_entry))]
    public entry fun new_game(ctx: &mut TxContext) {
        let lantern = Lantern {
            id: object::new(ctx),
            sanity: MAX_SANITY,
            oil: MAX_OIL,
            light_level: STARTING_LIGHT,
            is_alive: true,
        };
        transfer::transfer(lantern, tx_context::sender(ctx));
    }

    // Burn lantern
    #[allow(lint(public_entry))]
    public entry fun burn(lantern: Lantern) {
        let Lantern { id, sanity: _, oil: _, light_level: _, is_alive: _ } = lantern;
        object::delete(id);
    }

    // Update stats
    public fun update_stats(lantern: &mut Lantern, _sanity_delta: u64, oil_delta: u64) {
        if (lantern.oil > oil_delta) {
            lantern.oil = lantern.oil - oil_delta;
        } else {
            lantern.oil = 0;
            lantern.is_alive = false;
        };
    }
}
