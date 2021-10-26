---
title: "Monad Transformers – Part 2: How it works?"
date: 2021-10-24T20:28:16+07:00
draft: true
tags: ["haskell", "monad"]
categories: ["Code", "Theory"]
series: "Monad Transformers"
---

{{< series >}}

In [part 1]({{< relref "monad-transformers-1" >}}), we left off by showing a glimpse of the monad transformer version of `[Maybe a]` and `IO (Maybe a)`.

In this part, we'll take a look in more details on how it actually works. Let's start by introducing the first transformer.

## The `MaybeT` monad transformer.

A `MaybeT` has the following type signature:

```hs
newtype MaybeT m a :: MaybeT {
  runMaybeT :: m (Maybe a)
}
```

{{% notice note %}}
Note that all monad transformers use a suffix `*T` as part of their naming convention. For example `MaybeT`, `ReaderT`, `StateT`, etc.
{{% /notice %}}
