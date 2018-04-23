#lang racket
(provide (all-defined-out))

;; Add a contract here
(define shift-left
  (lambda (ls)
    (if (or (empty? ls) (equal? (length ls) 1))
      ls
      (append (cdr ls) (list (car ls))))))

;; Add a contract here
(define shift-k-left
  (lambda (ls k)
    (if (equal? k 0)
      ls
      (shift-k-left (shift-left ls) (- k 1)))))

;; Add a contract here
(define shift-right
  (lambda (ls)
    (if (or (empty? ls) (equal? (length ls) 1))
      ls
      (append (list (last ls)) (take ls (- (length ls) 1))))))

;; Add a contract here
(define combine
  (lambda (ls1 ls2)
    (if (empty? ls1)
      ls2
      (if (empty? ls2)
        ls1
        (append (append (list (car ls1)) (list (car ls2))) (combine (cdr ls1) (cdr ls2)))))))

;; Add a contract here
(define sum-tree
  (lambda (tree)
    (if (empty? tree)
      0
      (foldl (lambda (root curr-sum)
        (+ curr-sum (sum-tree root))) (car tree) (cdr tree)))))

;; Add a contract here
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
     
    
