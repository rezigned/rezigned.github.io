---
title: "Monad Transformer made easy"
date: 2021-10-13T09:53:46+07:00
draft: false
tags: ["haskell", "monad"]
categories: ["Code", "Theory"]
---

> A quick refresher of what is "Monad transformers".

What is the **Monad Transformer**"? The best way to understand this is to show why we need it in the first place.

## The basic
Let's start with the most basic possible Monad. The `Maybe` monad. Here's the type signature for `Maybe` type.

```hs
Maybe a :: Nothing | Just a
```
{{% notice note %}}
Other programming languages usually represent this type with `Option<T>`.
{{% /notice %}}


We use `Maybe` to represent an optional value. For example. The `div :: a -> a -> a` function will throw exception when using `0` as divisor.

```hs
> 1 `div` 0

-- Exception: divide by zero
```
So, instead we could use `Maybe` type to turn `div` into total function.

```hs
div' :: Int -> Int -> Maybe Int
div' x 0 = Nothing
div' x d = Just $ x `div` d
```
We can now have a safe division.

```hs
> 1 `div'` 0

Nothing
```

## Going further

Next, let's go one step further. We will still be working with optional value (`Maybe a`). But this time, it's contained in another type.

### List of optional values `[Maybe a]`

If we want to apply some transformation to these list of optional values. How could we do that?

We know that we could use `map` to apply a function to a list of values e.g. `[a]`.

```hs
map :: (a -> b) -> [a] -> [b]
```

But what about list of optional values (`[Maybe a]`)?

```hs
(a -> b) -> [Maybe a] -> [Maybe b]
```

There're many ways to implement this. But in order to demonstrate the purpose of *Monad Transformers*. We'll implement it via `do` notation with binding arrow (`<-`).

{{% notice note %}}
In practice, we would define `map'` as `map' = fmap . fmap` instead. But here, we want to demonstrate the difference between a simple monad *vs.* transformer version.
{{% /notice %}}

{{< highlight hs "linenos=inline,hl_lines=3 4,linenostart=1,anchorlinenos=true,lineanchors=a" >}}
map' :: (a -> a) -> [Maybe a] -> [Maybe a]
map' f xs = do
  x <- xs          -- 1
  return $ f <$> x -- 2
{{< / highlight >}}

1. The first thing we do is to use `<-` arrow to access `Maybe a` inside `[]`. i.e. `x :: Maybe a`.
1. Since `x` is `Maybe a`, we can use `fmap :: (a -> b) -> f a -> f b` to apply function to `a` directly.

```hs
> map' (+2) [Just 1, Just 5, Nothing]

[Just 3, Just 7, Nothing]
```

### Action with optional value `IO (Maybe a)`

We'll write a simple program that asks user to choose whether to continue or stop.

```hs {linenos=inline,hl_lines=[11,12],linenostart=1}
import Data.Char (toLower)

accept :: IO (Maybe String)
accept = do
  s <- getLine
  if map toLower s == "y"
    then return $ Just s
    else return Nothing

main = IO ()
  result <- accept -- 1
  case result of   -- 2
    Nothing -> putStrLn "Quit"
    Just _  -> putStrLn "Continue"
```

1. This is similar to what we did on previous example on `[Maybe a]`. We use binding arrow (`<-`) to access `Maybe String` value.
2. Next, we perform pattern matching on the result.

We'll jump ahead and show the

```hs
map'' :: (a -> b) -> MaybeT [] a -> MaybeT [] b
map'' f xs = f <$> xs
```
---

```hs
MaybeT :: m a -> m (Maybe a)

```

Here's another example

```hs
Maybe :: Just a | Nothing
```

[^1]: We would use something like `fmap . fmap` instead.
