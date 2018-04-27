#lang racket
(provide (all-defined-out))

; Signature: shift-left(ls) 
; Type: [List(any) -> List(any)] 
; Purpose: shift left the list. 
; Pre-conditions: None
; Tests: (shift-left '()) => '()
;        (shift-left '(5)) => '(5)
;        (shift-left '(1 2)) => '(2 1)
;        (shift-left '(1 2 3 4)) => '(2 3 4 1)
;        (shift-left '(1 (2 3) 4)) => '((2 3) 4 1)
(define shift-left
  (lambda (ls)
    (if (or (empty? ls) (equal? (length ls) 1))
      ls
      (append (cdr ls) (list (car ls))))))


; Signature: shift-k-left(ls k) 
; Type: [List(any) * Number -> List(any)] 
; Purpose: shift left k times the list. 
; Pre-conditions: None.
; Tests: (shift-k-left '() 5) => '()
;        (shift-k-left '(1) 100) => '(1)
;        (shift-k-left '(1 2 3) 0) => '(1 2 3)
;        (shift-k-left '(1 2 3) 1) => '(2 3 1)
;        (shift-k-left '(1 2 3) 2) => '(3 1 2)
;        (shift-k-left '(1 2 3) 3) => '(1 2 3)
(define shift-k-left
  (lambda (ls k)
    (if (equal? k 0)
      ls
      (shift-k-left (shift-left ls) (- k 1)))))


; Signature: shift-right(ls) 
; Type: [List(any) -> List(any)] 
; Purpose: shift right the list. 
; Pre-conditions: None
; Tests: (shift-right '()) => '()
;        (shift-right '(1)) => '(1)
;        (shift-right '(1 2 3)) => '(3 2 1)
;        (shift-right '(3 1 2)) => '(2 3 1)
(define shift-right
  (lambda (ls)
    (if (or (empty? ls) (equal? (length ls) 1))
      ls
      (append (list (last ls)) (take ls (- (length ls) 1))))))


; Signature: combine(ls1 ls2) 
; Type: [List(any) * List(any) -> List(any)] 
; Purpose: combine - takes two lists and combines them in an alternating manner starting from the first . 
; Pre-conditions: None
; Tests: (combine '() '()) => '()
;        (combine '(1 2 3) '()) => '(1 2 3)
;        (combine '() '(4 5 6)) => '(4 5 6)
;        (combine '(1 3) '(2 4)) => '(1 2 3 4)
;        (combine '(1 3) '(2 4 5 6)) => '(1 2 3 4 5 6)
;        (combine '(1 2 3 4) '(5 6)) => '(1 5 2 6 3 4)
(define combine
  (lambda (ls1 ls2)
    (if (empty? ls1)
      ls2
      (if (empty? ls2)
        ls1
        (append (append (list (car ls1)) (list (car ls2))) (combine (cdr ls1) (cdr ls2)))))))


; Signature: sum-tree(tree) 
; Type: [T(T|Number) -> Number] 
; Purpose: sums the numbers of the nodes of the tree. 
; Pre-conditions: all numbers>=0.
; Tests: (sum-tree '()) => 0
;        (sum-tree '(5)) => 5
;        (sum-tree ’(5 (1 (2) (3)))) => 11
;        (sum-tree ’(5 (1 (2) (3) (6)) (7))) => 24
;        (sum-tree ’(5 (1 (2) (3 (12) (12)) (6)) (7))) => 48
(define sum-tree
  (lambda (tree)
    (if (empty? tree)
      0
      (foldl (lambda (root curr-sum)
        (+ curr-sum (sum-tree root))) (car tree) (cdr tree)))))


; Signature: inverse-tree(tree) 
; Type: [T(T|Number|boolean) -> T(T|Number|boolean)] 
; Purpose: return a tree that satisfies - when the node conatins number return -number , when boolean return (not boolean).
; Pre-conditions: None.
; Tests: (inverse-tree '()) => '()
;        (inverse-tree '(5)) => '(-5)
;        (inverse-tree '(0)) => '(0)
;        (inverse-tree '(#f)) => '(#t)
;        (inverse-tree '(-5(1 (-2) (3) (#f)) (#t))) => '(5 (-1 (2) (-3) (#t)) (#f))
(define inverse-tree
  (lambda (tree)
    (if (empty? tree)
      tree
      (append (list (if (boolean? (car tree))
                              (not (car tree))
                              (- (car tree))))
              (if (empty? (cdr tree))
                (cdr tree)
                (foldl (lambda (root curr-tree) 
                          (append curr-tree (list (inverse-tree root)))) '() (cdr tree)))))))
     
    
