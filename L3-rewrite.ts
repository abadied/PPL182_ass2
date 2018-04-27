import { filter, map, reduce, zip } from "ramda";
import { first, isArray, isBoolean, isEmpty, isNumber, isString, rest, second, isLetStarExp, makeLetExp, makeLetStarExp, LetStarExp, LetExp, makeProgram, makeDefineExp, isVarDecl, makeBinding, isBinding, isAtomicExp, Binding } from "./L3-ast";
import { AppExp, AtomicExp, BoolExp, CompoundExp, CExp, DefineExp, Exp, IfExp, LitExp, NumExp,
         Parsed, PrimOp, ProcExp, Program, StrExp, VarDecl, VarRef } from "./L3-ast";
import { allT, getErrorMessages, hasNoError, isError }  from "./L3-ast";
import { isAppExp, isBoolExp, isCExp, isDefineExp, isExp, isIfExp, isLetExp, isLitExp, isNumExp,
             isPrimOp, isProcExp, isProgram, isStrExp, isVarRef } from "./L3-ast";
import { makeAppExp, makeBoolExp, makeIfExp, makeLitExp, makeNumExp, makeProcExp, makeStrExp,
         makeVarDecl, makeVarRef } from "./L3-ast";
import { parseL3 } from "./L3-ast";
import { isClosure, isCompoundSExp, isEmptySExp, isSymbolSExp, isSExp,
         makeClosure, makeCompoundSExp, makeEmptySExp, makeSymbolSExp,
         Closure, CompoundSExp, SExp, Value } from "./value";


export const rewriteLetStar = (cexp: Parsed | Error) : LetExp  | Error => 
{
    if(isLetStarExp(cexp)){
        if(cexp.bindings.length > 1){
            const written = rewriteLetStar(makeLetStarExp([cexp.bindings[0]], cexp.body));
            if(isCExp(written)){
                return makeLetExp([cexp.bindings[0]], [written]);
            } else{
                return written;
            }
            
        } else{
            return makeLetExp(cexp.bindings, cexp.body);
        }
    } else{
        return Error("Not an let* expression: " + cexp);
    }
}

export const rewriteAllLetStar = (cexp: Parsed | Binding | Error) : Parsed | Binding | Error =>
{
	return isBoolExp(cexp) ? cexp :
           isNumExp(cexp) ? cexp :
           isPrimOp(cexp) ? cexp :
           isVarRef(cexp) ? cexp :
           isError(cexp) ? cexp :
           isStrExp(cexp) ? cexp :
           isLitExp(cexp) ? cexp:
           isProgram(cexp) ? 
               makeProgram(map(rewriteAllLetStar,cexp.exps)) :
           isDefineExp(cexp) ? 
               makeDefineExp(cexp.var,map(rewriteAllLetStar,cexp.val)) :
           isIfExp(cexp) ? 
               makeIfExp(map(rewriteAllLetStar, cexp.test), map(rewriteAllLetStar,cexp.then), map(rewriteAllLetStar,cexp.alt)):
            
           isAppExp(cexp) ? 
                   makeAppExp(map(rewriteAllLetStar(cexp.rator)), map(rewriteAllLetStar,cexp.rands)) :
           isLetStarExp(cexp) ? rewriteLetStar(cexp):
           isLetExp(cexp) ? makeLetExp(cexp.bindings, map(rewriteAllLetStar,cexp.body)):
           isProcExp(cexp) ? makeProcExp(map(rewriteAllLetStar, cexp.args), map(rewriteAllLetStar, cexp.body)):
           Error("Unexpected expression " + cexp);
}
