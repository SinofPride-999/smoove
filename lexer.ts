export enum TokenType {
    // Literal Types
    Number,
    Identifier,

    // Keywords
    Let,

    // Grouping * Operators
    Equals,
    OpenParen,
    CloseParen,
    BinaryOperator,
    EOF,
}

const KEYWORDS: Record<string, TokenType> = {
    "let": TokenType.Let,
};

export interface Token {
    value: string;
    type: TokenType;
}

function token (value = "", type: TokenType): Token {
    return { value, type }
}

function is_alpha (src: string): boolean {
    return src.toUpperCase() != src.toLowerCase();
}

function is_int (str: string): boolean {
    const c = str.charCodeAt(0);    // return the unicode value of the character at index 0
    const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];  // is this character within the bounds of 0 -9

    return (c >= bounds[0] && c <= bounds[1]);
}

function is_skippable (str: string): boolean {
    return str == ' ' || str == '\n' || str == '\t';
}

export function tokenize(source_code: string): Token[] {
    const tokens = new Array<Token>();
    const src = source_code.split("");

    // build each token until EOF
    while (src.length > 0) {
        if (src[0] == '(') {
            tokens.push(
                token(src.shift(), TokenType.OpenParen)
            )
        } else if (src[0] == ')') {
            tokens.push(
                token(src.shift(), TokenType.CloseParen)
            )
        } else if (src[0] == "+" || src[0] == "-" || src[0] == "*" || src[0] == "/") {
            tokens.push(
                token(src.shift(), TokenType.BinaryOperator)
            )
        } else if (src[0] == '=') {
            tokens.push(
                token(src.shift(), TokenType.Equals)
            )
        } else {
            // handle multi-character tokens

            // build number token
            if (is_int(src[0])) {
                let num = "";
                while (src.length > 0 && is_int(src[0])) {
                    num += src.shift();
                }

                tokens.push(token(num, TokenType.Number));
            } else if (is_alpha(src[0])) {
                let ident = "";
                while (src.length > 0 && is_alpha(src[0])) {
                    ident += src.shift();
                }
                // check for reserved keywords
                const reserved = KEYWORDS[ident];
                if (reserved == undefined) {
                    tokens.push(token(ident, TokenType.Identifier));
                } else {
                    tokens.push(token(ident, reserved));
                }
            } else if (is_skippable(src[0])) {
                src.shift();
            } else {
                console.log("Unrecognized character found in source: ", src[0]);
                Deno.exit(1);
            }
        }
    }

    tokens.push({ type: TokenType.EOF, value: "EndOfFile" });
    return tokens;
}

// const source = await Deno.readTextFile("./test.txt");
// for (const token of tokenize(source)){
//     console.log(token);
// }
