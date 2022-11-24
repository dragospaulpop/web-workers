self.onmessage = evt => {
  const { count } = evt.data

  const result = iterate(count)

  self.postMessage({ result })
}

function iterate (n) {
  const primes = []
  let current = 4
  while (primes.length < n) {
    let isPrime = true
    for (let i = 2; i <= current / 2; i++) {
      if (current % i === 0) isPrime = false
    }
    if (isPrime) primes.push(current)
    current++
  }

  return primes
}
