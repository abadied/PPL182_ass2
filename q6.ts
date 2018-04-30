import { CExp, Exp, PrimOp, Program, DefineExp } from "./L1-ast";
import { hasError, isAppExp, isBoolExp, isCExp, isDefineExp, isError, isNumExp, isPrimOp,
         isProgram, isVarRef, isVarDecl } from "./L1-ast";
import { parseL1 } from "./L1-ast";
import { first, isEmpty, rest } from "./L1-ast";
import * as assert from "assert";
import { filter, map, reduce } from "ramda";


export const unparse = (x: Program | DefineExp | CExp) : string | Error => {
    return isProgram(x) ? reduce((acc, curr) => acc + " " + unparse(curr), "(L1", x.exps) +")":
           isDefineExp(x) ? "(define " + unparse(x.var) + " " + unparse(x.val) + ")" :
           isCExp(x) ?
           isNumExp(x) ? x.val.toString(): 
           isBoolExp(x) ?  x.val? "#t" : "#f":
           isPrimOp(x) ? x.op:
           isVarRef(x) ? x.var:
           isVarDecl(x) ? x.var:
           isError(x) ? x.message:
           isAppExp(x) ? "(" + unparse(x.rator)  + reduce((acc, curr) => acc + " " + unparse(curr), "", x.rands) + ")" :
           Error("Unknown cexp type: " + x):
           Error("Unknown type: " + x);
}

// console.log(unparse(parseL1("(L1 (define x 5) (+ x 5) (+ (+ (- x y) 3) 4) (and #t x))")));
    
    
    
    



