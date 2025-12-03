import { Statement, Program, Expression, BinaryExpression, NumericLiteral, Identifier } from './ast.ts';
import { tokenize, Token, TokenType } from "./lexer.ts";

export default class Parser {
    private tokens: Token[] = [];

    private not_eof (): boolean {
        return this.tokens[0].type != TokenType.EOF;
    }

    private at (): Token {
        return this.tokens[0] as Token;
    }

    private eat (): Token {
        const prev = this.tokens.shift() as Token;
        return prev;
    }

    public produce_ast (source_code: string): Program {
        this.tokens = tokenize(source_code);
        const program: Program = {
            kind: "Program",
            body: [],
        };

        // parse until end of file
        while (this.not_eof()) {
            program.body.push(this.parse_statement());
        }

        return program;
    }

    private parse_statement (): Statement {
        // for now skip to parse_expression
        return this.parse_expression();
    }
    private parse_expression (): Expression {
        return this.parse_primary_expression();
    }

    private parse_primary_expression (): Expression {
        const token = this.at().type;

        switch (token) {
            case TokenType.Identifier:
                return {
                    kind: "Identifier",
                    symbol: this.eat().value
                } as Identifier;
            case TokenType.Number:
                return {
                    kind: "NumericLiteral",
                    symbol: parseFloat( this.eat().value)
                } as NumericLiteral;

            default:
                console.error("Unexpected token found during parsing!", this.at())
                Deno.exit(1);
        }
    }

}
