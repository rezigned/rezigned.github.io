---
title: "Monad Transformers – Part 2: The First Transformer"
date: 2021-10-24T20:28:16+07:00
draft: true
tags: ["haskell", "monad"]
categories: ["Code", "Theory"]
series: "Monad Transformers"
---

{{< series >}}

> ~How it works vs under the hood vs The Stack~

In [part 1]({{< relref "monad-transformers-1" >}}), we left off by showing a glimpse of the monad transformer version of `[Maybe a]` and `IO (Maybe a)`.

In this part, we'll take a look in more details on how it actually works. Let's start by introducing the first monad transformer.

## The `MaybeT` monad transformer.

`MaybeT` has the following type signature:

```hs
newtype MaybeT m a :: MaybeT {
  runMaybeT :: m (Maybe a)
}
```

{{% notice note %}}
Note that all monad transformers use a suffix `*T` as part of their naming convention. For example `MaybeT`, `ReaderT`, `StateT`, etc.
{{% /notice %}}

From the type signature. We know that `m` has *kind* `* -> *`. Our example `[]` and `IO` also have this exact kind as well. Let's compare the new `MaybeT m a` type with one of our example i.e. `[] a`.

{{% half %}}

```hs
> m  (Maybe a)      -- 1
> [] (Maybe String) -- 2 [Maybe String]
```
{{% center %}}Maybe{{% /center %}}
---

```hs
> MaybeT m  a      -- 1
> MaybeT [] String -- 2
```
{{% center %}}MaybeT{{% /center %}}
{{% /half %}}

1. We started by showing the type signature for both versions.
2. Then we applied our concrete types to type parameters: `m` with `[]` and `a` with `String`.

As you can see, the `MaybeT` version looks almost the same as `Maybe` one. The only difference is the position of `m` and `Maybe`/`MaybeT`. What do we gain from that?

Recall from part 1, we saw the repetitive patterns when accessing `Maybe a` wrapped in another types (e.g. we have to use *bind operation* to access `Maybe a` in `IO (Maybe a)`, etc.).

How could we avoid this? Let's revisit `Monad` typeclass for a moment.

### Revisiting Monad typeclass

Monad typeclass definition:

```hs
class Applicative m => Monad m where
  return :: a -> m a
  (>>=) :: m a -> (a -> m b) -> m b
```

The `m` in `Monad` typeclass definition has kind `* -> *`. When we want to make our type an instance of `Monad` typeclass we must make sure our type also has kind `* -> *`.

For example:

{{% half %}}
```hs
instance Monad Maybe where
```
{{% center %}}Correct. Because `Maybe` has kind `* -> *`{{% /center %}}
---
```hs
instance Monad (Maybe a) where
```
{{% center %}}Wrong. Because `Maybe a` has kind `*`{{% /center %}}
{{% /half %}}

What if our type has kind `* -> * -> *` (our friend `MabyeT m a`)? Then, we have to use `MabyeT m` as an instance, since it has kind `* -> *`:

{{% half %}}
```hs
instance Monad (MaybeT m) where
```
{{% center %}}Correct. Because `MaybeT m` has kind `* -> *`{{% /center %}}
---
```hs
instance Monad MaybeT where
```
{{% center %}}Wrong. Because `MaybeT` has kind `* -> * -> *`{{% /center %}}
{{% /half %}}

By making `MaybeT m` as part of `Monad` instance declaration. It allows us to make an interesting thing with the type parameter `m`. For example, we could put the constraint on it! Let's make `m` also an instance of `Monad`!

```hs
instance (Monad m) => Monad (MaybeT m) where
```

You could have guessed what we're trying to archive here. By making `m` an instance of `Monad` typeclass. We don't really need to know wheather its type is `[]` or `IO`, etc. as long as it's an instance of `Monad`. We're fine with it.

### Implementing `MaybeT` monad transformer.

---

```hs
xs = [Just 3, Nothing, Just 1]

f xs = do
  x <- xs -- 1. Unwrap `[Maybe a]`. x :: Maybe a
  m <- x  -- 2. Unwrap `Maybe a`. m :: a
```

```hs
IO String

MaybeT
IO -- base monad
```

### Stack

```
type App = ReaderT AppConfig (StateT AppState IO)

-- Stack
ReaderT
StateT
IO -- base

IO -> state -> reader

-- Usage
runStateT (runReaderT k config) state

reader -> state -> IO
```
