---
title: "Monad Transformer made easy"
date: 2021-10-13T09:53:46+07:00
draft: false
tags: ["haskell", "monad"]
categories: ["Code", "Theory"]
---

> A quick reminder of what is "Monad transformers".

What is the `Monad Transformer`? The best way to understand this is to show why we need it in the first place.

Let's start with the most basic possible Monad. The `Maybe` monad. (Other programming languages usually represent this type with `Option<T>`).

Here's the type signature for `Maybe` type.

```hs
Maybe a :: Nothing | Just a
```

We use `Maybe` to represent an optional value. For example. The `div :: a -> a -> a` function will throw exception when using `0` as divisor.

```hs
1 `div` 0

-- Exception: divide by zero
```
So, instead we could use `Maybe` type to turn `div` into total function.

```hs
div' :: Integral a => a -> a -> Maybe a
div' x 0 = Nothing
div' x d = Just $ x `div` d
```
We can now have a safe division.

```hs
1 `div'` 0

> Nothing
```

Now, let's say we want to store optional value into another type e.g. `[Maybe a]`.

In order to work with optional value in `[a]` type. We somehow need to apply a function to the monadic value inside the list type. We could implement it like this.

```hs
product :: [Maybe Int] -> Int
product []     = 1
product (x:xs) = case x of
  Nothing -> 1 * p xs
  Just n  -> n * p xs
```
---

```hs
MaybeT :: m a -> m (Maybe a)
```

Here's another example

```hs
Maybe :: Just a | Nothing
```
