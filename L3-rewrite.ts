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
            const written = rewriteLetStar(makeLetStarExp(cexp.bindings.slice(1), cexp.body));
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

// export const rewriteAllLetStar = (cexp: Parsed | Binding | Error) : Parsed | Binding | Error =>
// {
// 	return isBoolExp(cexp) ? cexp :
//            isNumExp(cexp) ? cexp :
//            isPrimOp(cexp) ? cexp :
//            isVarRef(cexp) ? cexp :
//            isError(cexp) ? cexp :
//            isStrExp(cexp) ? cexp :
//            isLitExp(cexp) ? cexp:
//            isProgram(cexp) ? 
//                makeProgram(map(rewriteAllLetStar,cexp.exps)) :
//            isDefineExp(cexp) ? 
//                makeDefineExp(cexp.var,map(rewriteAllLetStar,cexp.val)) :
//            isIfExp(cexp) ? 
//                makeIfExp(map(rewriteAllLetStar, cexp.test), map(rewriteAllLetStar,cexp.then), map(rewriteAllLetStar,cexp.alt)):
            
//            isAppExp(cexp) ? 
//                    makeAppExp(rewriteAllLetStar(cexp.rator), map(rewriteAllLetStar,cexp.rands)) :
//            isLetStarExp(cexp) ? rewriteAllLetStar(rewriteLetStar(cexp)):
//            isLetExp(cexp) ? makeLetExp(map((cexp) => {let cexp_val = rewriteAllLetStar(cexp.val); return isCExp(cexp_val) ?  makeBinding(cexp.var, cexp_val):  Error("Unexpected expression " + cexp);},cexp.bindings), map(rewriteAllLetStar,cexp.body)):
//            isProcExp(cexp) ? makeProcExp(map(rewriteAllLetStar, cexp.args), map(rewriteAllLetStar, cexp.body)):
//            Error("Unexpected expression " + cexp);
// }

export const rewriteAllLetStar = (cexp: Parsed | Binding | Error) : Parsed | Binding | Error =>
{
	if(isBoolExp(cexp) || isNumExp(cexp) || isPrimOp(cexp) || isVarRef(cexp) || isError(cexp) || isStrExp(cexp) || isLitExp(cexp)){
        return cexp;
    }else if(isProgram(cexp)){ 
        return  makeProgram(map(rewriteAllLetStar,cexp.exps));
    } else if(isDefineExp(cexp)){
        return makeDefineExp(cexp.var,map(rewriteAllLetStar,cexp.val));
    }else if(isIfExp(cexp)){
        return makeIfExp(map(rewriteAllLetStar, cexp.test), map(rewriteAllLetStar,cexp.then), map(rewriteAllLetStar,cexp.alt)); 
    }else if(isAppExp(cexp)){
        const rator = rewriteAllLetStar(cexp.rator);
        if(isCExp(rator)){
            return makeAppExp(rator, map(rewriteAllLetStar,cexp.rands));
        }else{
            return Error("Unexpected expression " + cexp);
        }
    }else if(isLetStarExp(cexp)){
        return rewriteAllLetStar(rewriteLetStar(cexp));
    }else if(isLetExp(cexp)){
        return  makeLetExp(map((cexp) => {let cexp_val = rewriteAllLetStar(cexp.val); return isCExp(cexp_val) ? makeBinding(cexp.var, cexp_val) : Error("Unexpected expression " + cexp);}, cexp.bindings), map(rewriteAllLetStar,cexp.body));
    }else if(isProcExp(cexp) ){
        return makeProcExp(map(rewriteAllLetStar, cexp.args), map(rewriteAllLetStar, cexp.body));
    }else{
        return Error("Unexpected expression " + cexp);
    }
}

// console.log(JSON.stringify(parseL3("(let* ((x 3) (y x)) x y)"), null, 4));
// console.log(JSON.stringify(
//     rewriteLetStar(parseL3("(let* ((x 5) (y x) (z y)) (+ 1 2))")),null,4));
// console.log(JSON.stringify(rewriteAllLetStar(parseL3
//     ("(let* ((x (let* ((y 5)) y)) (z 7)) (+ x (let* ((t 12)) t)))")),
//     null,4));