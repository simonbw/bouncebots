export function memoize<K, V>(
  f: (p: K) => V,
  getKey: (p: K) => any = (arg) => arg
): (p: K) => V {
  const answers = new Map<K, V>();

  return (arg) => {
    const key = getKey(arg);
    if (!answers.has(key)) {
      answers.set(key, f(arg));
    }
    return answers.get(arg)!;
  };
}

class LruCache<K, V> {
  private values: Map<K, V> = new Map<K, V>();
  private maxEntries: number = 2 ** 16;

  public has(key: K): boolean {
    return this.values.has(key);
  }

  public get(key: K): V | undefined {
    let entry: V | undefined;
    if (this.values.has(key)) {
      // peek the entry, re-insert for LRU strategy
      entry = this.values.get(key)!;
      this.values.delete(key);
      this.values.set(key, entry);
    }

    return entry;
  }

  public set(key: K, value: V) {
    if (this.values.size >= this.maxEntries) {
      // least-recently used cache eviction strategy
      const keyToDelete = this.values.keys().next().value;

      this.values.delete(keyToDelete);
    }

    this.values.set(key, value);
  }
}
