module lantern_protocol::item {
    use std::string::{Self, String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::random::{Self, Random};

    // Tắt cảnh báo hằng số chưa dùng (vì sau này mới dùng)
    #[allow(unused_const)]
    const RARITY_COMMON: u8 = 1;
    #[allow(unused_const)]
    const RARITY_RARE: u8 = 2;
    #[allow(unused_const)]
    const RARITY_EPIC: u8 = 3;
    #[allow(unused_const)]
    const RARITY_LEGENDARY: u8 = 4;
    #[allow(unused_const)]
    const RARITY_CURSED: u8 = 5;

    const FLOAT_SCALING: u64 = 10000000000;

    // Cho phép dùng public struct trong Move 2024
    public struct GameItem has key, store {
        id: UID,
        name: String,
        description: String,
        rarity: u8,
        power: u64,
        void_resonance: u64,
    }

    // Tắt cảnh báo lint về public entry (Move 2024 khuyên dùng public fun cho PTB, nhưng entry vẫn ổn cho ví)
    #[allow(lint(public_entry))]
    public entry fun mint(
        name: vector<u8>,
        description: vector<u8>,
        rarity: u8,
        power: u64,
        r: &Random,
        ctx: &mut TxContext
    ) {
        let mut generator = random::new_generator(r, ctx);
        let random_resonance = random::generate_u64_in_range(&mut generator, 0, FLOAT_SCALING);

        let item = GameItem {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            rarity: rarity,
            power: power,
            void_resonance: random_resonance, 
        };

        transfer::public_transfer(item, tx_context::sender(ctx));
    }

    public fun get_resonance(item: &GameItem): u64 {
        item.void_resonance
    }

    #[allow(lint(public_entry))]
    public entry fun transfer_item(item: GameItem, recipient: address, _ctx: &mut TxContext) {
        transfer::public_transfer(item, recipient);
    }

    #[allow(lint(public_entry))]
    public entry fun burn(item: GameItem) {
        let GameItem { id, name: _, description: _, rarity: _, power: _, void_resonance: _ } = item;
        object::delete(id);
    }
}