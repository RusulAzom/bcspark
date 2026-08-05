/**
 * Floor/Block-Based Distributed Sampling Engine
 *
 * Instead of Math.random() on the full 1800+ array (which causes lag),
 * we divide the dataset into floor blocks (e.g., 0-99, 100-199, 200-299...)
 * and pick items from distributed blocks for high-entropy coverage.
 */

const BLOCK_SIZE = 100;

/**
 * Build block metadata: array of { startIndex, endIndex, count }
 */
function buildBlocks(totalLength) {
  const blocks = [];
  for (let start = 0; start < totalLength; start += BLOCK_SIZE) {
    const end = Math.min(start + BLOCK_SIZE, totalLength);
    blocks.push({ startIndex: start, endIndex: end, count: end - start });
  }
  return blocks;
}

/**
 * Pick `count` items from the dataset using floor-block distribution.
 * Ensures items are spread across the entire dataset range.
 */
export function sampleDistributed(data, count) {
  const total = data.length;
  if (total === 0) return [];
  if (count >= total) return [...data];

  const blocks = buildBlocks(total);
  const result = [];
  const usedIndices = new Set();

  // Distribute picks across blocks in round-robin fashion
  let blockIndex = 0;
  let safety = 0;
  while (result.length < count && safety < count * 3) {
    safety++;
    const block = blocks[blockIndex % blocks.length];
    blockIndex++;

    // Try to pick a random unused index from this block
    let attempts = 0;
    let picked = false;
    while (attempts < 5 && !picked) {
      const randOffset = Math.floor(Math.random() * block.count);
      const candidateIndex = block.startIndex + randOffset;
      if (!usedIndices.has(candidateIndex)) {
        usedIndices.add(candidateIndex);
        result.push(data[candidateIndex]);
        picked = true;
      }
      attempts++;
    }

    // If block is exhausted, try next block
    if (!picked) continue;
  }

  // Fallback: if we still need more, fill from remaining unused indices
  if (result.length < count) {
    for (let i = 0; i < total && result.length < count; i++) {
      if (!usedIndices.has(i)) {
        usedIndices.add(i);
        result.push(data[i]);
      }
    }
  }

  // Shuffle final result for randomness
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

/**
 * Get a single random item from a specific floor block.
 * Useful for targeted sampling if needed.
 */
export function sampleFromBlock(data, blockNumber) {
  const total = data.length;
  const blocks = buildBlocks(total);
  const block = blocks[blockNumber % blocks.length];
  if (!block) return null;
  const randOffset = Math.floor(Math.random() * block.count);
  return data[block.startIndex + randOffset];
}