# skills-doordash

Skills — doordash (5): doordash-allergy-shield, doordash-group-orders, doordash-order-ledger, doordash-order-playbooks, doordash-spend-guard.

| Skill | Description |
|---|---|
| doordash-allergy-shield | Persistent dietary safety layer for DoorDash CLI (dd-cli) ordering. Stores a personal/household dietary profile (allergens with severity tiers, diets, dislikes) that every cart is vetted against before checkout, with a deterministic tripwire — the vetting ste… |
| doordash-group-orders | Group food ordering through the DoorDash CLI (dd-cli) from a persistent team roster. One request ("lunch for the team") fans out into a single merged cart with every line attributed to its eater via a person-to-cart-item-id ledger, per-person cost split with… |
| doordash-order-ledger | Accountability layer for agent-driven DoorDash ordering. Works with the doordash-audit-log hook (which appends every dd-cli invocation to an append-only audit log) and the /doordash-report command to answer "what has my AI been ordering and what did it cost"… |
| doordash-order-playbooks | Named, context-bound saved DoorDash orders ("post-gym", "late-night deploy") recalled through the DoorDash CLI (dd-cli) with a mandatory cart-diff before any checkout link is handed over. Use when the user names a saved order ("order my post-gym bowl", "the u… |
| doordash-spend-guard | Hard spending policy for agent-driven DoorDash ordering through the DoorDash CLI (dd-cli). Per-order ceiling, daily/weekly/monthly caps, cooldown between orders, and blocked hours — enforced deterministically by routing every cart-mutation and checkout throug… |
