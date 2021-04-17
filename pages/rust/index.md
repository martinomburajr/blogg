# Rust Generics at An Assembly Level

Rust like many languages today makes use of generics or more formally named
parametric polymorphism. Generics simple allow a user to define a "stand-in
parameter to a set of types (functions, structs, enums, struct implementations)

However this is typically a point of confusion to many individuals. Generics are
only generic until a certain point before the rust compiler has to ask you to be
a bit more specific,

As usual all code in this article will be housed in a `main()` for easier
copy/paste and testing.

```rust
fn main() {
    #[no_mangle]
    fn non_generic_fn(b: i64) -> i64 {
        b
    }

    let _ans = non_generic_fn(1234_i64);
}
```
*caption-goes-here*
In the snippet above, we create a simple function `non_generic_fn` that takes in
an argument `b` of type `i64` and returns the same variable `b` as an `i64`.
This function acts as a simple "pass-through" function. We collect the result
and store it in a variable `_ans`. We add the `#[no_mangle]` outer attribute to
ensure our function names remain intact and are not modified or decorated by the
compiler. This is mostly for convenience when analyzing the resulting assembly.

## Assembly Code
The code compiles, run's and doesn't really do anything unsurprisingly. Let's
take a look at the generated assembly. This snippet isn't much but it will serve
as a starting point as we investigate further.

```bash
objdump --x86-asm-syntax=att --demangle -d ../target/debug/<your-crate-name> > ./src/non_generics.o
```

```nasm
; entry to Rust's main method
00000001000037f0 generics::main::h7ecffc4403148146:
; We initialize the stack by setting the stack pointer %rsp, to the stack base pointer %rbp.
; This initializes a stack of 0 bytes as the top of the stack (%rsp) and base of the stack (%rbp)
; point to the exact same memory address
1000037f0: 55                          	pushq	%rbp
1000037f1: 48 89 e5                    	movq	%rsp, %rbp
; We allocate 16 bytes byt decrementing the top of the stack by 16 bytes.
1000037f4: 48 83 ec 10                 	subq	$16, %rsp
; We store the immediate (constant) 1234 into the 32 bit portion of the 64 bit %rdi register called %edi
; If the value was larger than 32bits i.e greater than i32::MAX, the %edi would change to %rdi as it has to
; use the entire 64-bit %rdi register to accommodate for the larger value. We also store it in the %rdi so that in the
; next call, where we call out to the `non_generic_fn`, we can use the value stored in %edi as an input parameter to the
; `non_generic_fn`.
1000037f8: bf d2 04 00 00              	movl	$1234, %edi
; We call our `non_generic_fn` let's look at the `non_generic_fn` procedure below before continuing.
1000037fd: e8 0e 00 00 00              	callq	14 <_non_generic_fn>
; Hopefully you've read through the `non_generic_fn` procedure below before continuing here.
; We take the value stored in %rax (the input to our `non_generic_fn`) and we allocate 8 bytes in the stack
; so we can store it.
100003802: 48 89 45 f8                 	movq	%rax, -8(%rbp)
; Now that we are done, we close the stack by eliminating the initial offset of the top of the stack to the bottom of the stack.
; we do this by incrementing the top of the stack by 16 bytes, which takes us back to the base of the stack. This deallocates
; the initialized memory.
100003806: 48 83 c4 10                 	addq	$16, %rsp
; We pop the stack, and return from main!
10000380a: 5d                          	popq	%rbp
10000380b: c3                          	retq
10000380c: 0f 1f 40 00                 	nopl	(%rax)

; The `non_generic_fn` procedure
0000000100003810 _non_generic_fn:
; Hopefully you are here immediately after the `call  14 <_non_generic_fn>` command above

; We start again by initializing the stack
100003810: 55                          	pushq	%rbp
100003811: 48 89 e5                    	movq	%rsp, %rbp
; We take the contents of the %rdi register that had the value 1234 (see above procedure) and place it 8 bytes offset from the base pointer
; In short, we are allocating 8 bytes for our argument `b: i64`. Why 8 bytes? because it is a 64-bit number we are allocating.
100003814: 48 89 7d f8                 	movq	%rdi, -8(%rbp)
; We also copy the contents (the number 1234) from the %rdi register into the accumulator register (%rax). By convention the %rax
; register in x86 is typically used for accumulating values or returning types from a function as we are about to do.
100003818: 48 89 f8                    	movq	%rdi, %rax
; We pop the stack, and return back to our calling function.
10000381b: 5d                          	popq	%rbp
10000381c: c3                          	retq
10000381d: 0f 1f 00                    	nopl	(%rax)




generics::main::h7ecffc4403148146:
               	pushq	%rbp
               	movq	%rsp, %rbp
               	subq	$16, %rsp
               	movl	$1234, %edi
               	callq	14 <_non_generic_fn>
               	movq	%rax, -8(%rbp)
               	addq	$16, %rsp
               	popq	%rbp
               	retq
               	nopl	(%rax)

_non_generic_fn:
               	pushq	%rbp
               	movq	%rsp, %rbp
               	movq	%rdi, -8(%rbp)
               	movq	%rdi, %rax
               	popq	%rbp
               	retq
               	nopl	(%rax)
```
The generated assembly as the following two procedures,
`<your-crate-name>:main::<some-random-string>` which is the `main` function, and
`_non_generic_fn` is the inner function in the earlier code snippet. Let's start
in `main`. I have annotated the assembly output to provide greater clarity (keep
in mind the memory addresses shown in the right could be any value and don't
need to match up with mine.)


```rust
fn main() {
    fn generic_fn<T>(b: T) -> T {
        b
    }

    let _ans = generic_fn(1234_i64);
}
```

In this case the snippet is similar, except we have a generic function
`generic_fn` that takes in a variable `b'` of type `T` and returns an element of
type `T`. We build the project then run

``` bash
cargo build;
objdump --x86-asm-syntax=att --demangle -d ../target/debug/<your-crate-name> > ./src/generics.o;
```


Let's examine the generated `generics.o` object file.

```x86asm
; Rust's main method
generics::main::h7ecffc4403148146:
               	pushq	%rbp
               	movq	%rsp, %rbp
; Initialize stack
               	subq	$16, %rsp
; Move 1234 to 32 bit portion of the %rdi register called %edi
               	movl	$1234, %edi
: Call the `generic_fn` procedure
               	callq	142 <__ZN8generics4main10generic_fn17hd668656b76776223E>
               	movq	%rax, -8(%rbp)
               	addq	$16, %rsp
               	popq	%rbp
               	retq
               	nopl	(%rax)

; `generic_fn` procedure
generics::main::generic_fn::hd668656b76776223:
               	pushq	%rbp
               	movq	%rsp, %rbp
; allocate 8 bytes in the stack and move the 1234 value from %rdi to the stack
               	movq	%rdi, -8(%rbp)
; move 1234 from %rdi to the %rax register
               	movq	%rdi, %rax
; pop the stack
               	popq	%rbp
               	retq
               	nop
               	nop
               	nop
```
As we can see from the code snippet xxx, we have near identical assembly
output between the `generic` and `non_generic` outputs. There is virtually no
difference in number of instructions as well as allocations.

## Conclusion

Generics are purely a programmer convenience tool that reduce repetition and can
communicate the general characteristics of a Rust type. They have little to no
impact on performance as they contain no additional instructions when compiled
down to assembly and machine code.

We can thank the Rust compiler team for that!