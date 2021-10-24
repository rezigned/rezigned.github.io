---
title: "Monad Transformers – Part 1: An Introduction"
date: 2021-10-24T20:28:16+07:00
draft: false
tags: ["haskell", "monad"]
categories: ["Code", "Theory"]
series: "Monad Transformers"
---

{{< series >}}

Once you've learned some basic of *"Monad"*. The next step in the journey is *"Monad Transformers"*. In this series, we'll use the basic building block of Haskell to learn about *"Monad Transformers"*.

## The basic
Let's start with the most basic possible Monad. The `Maybe` monad. Here's the type signature for `Maybe` type:

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
So, instead we could use `Maybe` type to turn `div` into *total function*.

```hs
div' :: Int -> Int -> Maybe Int
div' x 0 = Nothing
div' x d = Just $ x `div` d
```
With this, we can safely do a division by using any number as divisor!

```hs
> 1 `div'` 0

Nothing
```

## Going further

Next, let's go one step further. We will still be working with optional value (`Maybe a`). But this time, we'll put it in another type.

### 1. List of optional values `[Maybe a]`

If we want to apply some transformation to these list of optional values. How could we do that? Let's think about it a little bit.

We all know that we could use `map` to apply a function to a list of values e.g. `[a]`:

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
{{% center %}}**Example 1.1**: List of optional values (`[Maybe a]`).{{% /center %}}

1. The first thing we do is to use `<-` arrow to access `Maybe a` inside `[]`. i.e. `x :: Maybe a`.
1. Since `x` is `Maybe a`, we can use `fmap :: (a -> b) -> f a -> f b` to apply function to `a` directly.


Let's see it in action!

```hs
> map' (+2) [Just 1, Just 5, Nothing]

[Just 3, Just 7, Nothing]
```
### 2. Action with optional value `IO (Maybe a)`

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
    Just s  -> putStrLn $ s ++ ": Continue"
```
{{% center %}}**Example 1.2**: `IO` with optional value (`IO Maybe a`).{{% /center %}}

1. This is similar to what we did on previous example on `[Maybe a]`. We use binding arrow (`<-`) to access `Maybe String` value.
2. Next, we perform pattern matching on the result.

## Can you spot a pattern?

We might have noticed that there're some kind of repetitive pattern here. Whenever we want to get a hold of our optional value (`Maybe a`). We have to always call `<-` arrow first. Even though, we *don't really care* what the *outermost types* are (In our example, `[]` and `IO` respectively).

{{% notice info %}}
In example 1.1. We use `<-` to extract `Maybe a` out from `[]`.
```hs {linenos=inline,hl_lines=[1],linenostart=3}
  x <- xs -- 1
  return $ f <$> x
```

Here again, in example 1.2. We use `<-` to extract `Maybe a` out from `IO`.
```hs {linenos=inline,hl_lines=[1],linenostart=11}
  result <- accept -- 1
  case result of
```
{{% /notice %}}

Before we introduce our first *"Monad transformers"*. Let's take a sneak peek of the new *Monad transformers* version of our previous examples!

**List of optional values**

We can see that our transformer version on the right doesn't need to call `x <- xs` to get access to `Maybe a` any more:

{{% half %}}
```hs
map' f xs = do
  x <- xs -- 1
  return $ f <$> x
```
{{% center %}}Before{{% /center %}}
---
```hs
map'' f xs = f <$> xs
--
--
```
{{% center %}}After{{% /center %}}
{{% /half %}}

**Action with optional value**

Same thing here. We're no longer need `result <- accept` call:

{{% half %}}
```hs
result <- accept -- 1
case result of   -- 2
  Nothing -> putStrLn "Quit"
  Just s  -> putStrLn $ s ++ ": Continue"
```
{{% center %}}Before{{% /center %}}
---
```hs
result <- accept'
lift $ putStrLn $ r ++ ": Continue"
--
--
```
{{% center %}}After{{% /center %}}
{{% /half %}}

## Summary

In part 1. We started by showing what happened when we need to wrap our monadic values (i.e. `Maybe a`) in another type (`[]` and `IO`). We also showed a quick look of what will it look like when we use the *transformer* version.

In next post, we'll take a look in more details on how does it actually work.

{{% donate %}}
