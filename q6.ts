import { CExp, Exp, PrimOp, Program, DefineExp } from "./L1-ast";
import { hasError, isAppExp, isBoolExp, isCExp, isDefineExp, isError, isNumExp, isPrimOp,
         isProgram, isVarRef, isVarDecl } from "./L1-ast";
import { parseL1 } from "./L1-ast";
import { first, isEmpty, rest } from "./L1-ast";
import * as assert from "assert";
import { filter, map, reduce } from "ramda";


export const unparse = (x: Program | DefineExp | CExp) : string | Error => {
    return isProgram(x) ? reduce((acc, curr) => unparse(curr) + " " + acc, "", x):
           isDefineExp(x) ? "(define" + unparse(x.var) + " " + unparse(x.val) + ")" :
           isCExp(x) ?
           isNumExp(x) ? x.val : 
           isBoolExp(x) ? x.val:
           isPrimOp(x) ? x.op:
           isVarRef(x) ? x.var:
           isVarDecl(x) ? x.var:
           isError(x) ? x.message:
           isAppExp(x) ? "(" + reduce((acc, curr) => unparse(curr) + " " +  acc, "", x.rands) + unparse(x.rator) + ")" :
           Error("Unknown cexp type: " + x):
           Error("Unknown type: " + x);
}