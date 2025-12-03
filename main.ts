import Parser from "./parser.ts";

smoove();

function smoove () {
    const parser = new Parser();
    console.log("\nSmoove v0.1");

    while (true) {
        const input = prompt("~> ");

        // no user input or exit keyword????
        if (!input == null || input?.toLowerCase() === "exit") {
            Deno.exit(0);
        }

        const program = parser.produce_ast(input);
        console.log(program);
    }
}
