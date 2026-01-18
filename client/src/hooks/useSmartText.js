import { useMemo } from 'react';

/**
 * useSmartText Hook
 * Processes raw text into strictly balanced visual chunks for optimal reading flow.
 * 
 * Rules:
 * 1. Aggressive Merge: Merge short fragments (< 80 chars) to avoid 1-line orphans.
 * 2. Balanced Split: Break long blocks (> 220 chars) into roughly equal-sized pieces (~140 chars)
 *    rather than just clipping the first X characters.
 */
export const useSmartText = (text) => {
    return useMemo(() => {
        if (!text) return ["No content to read."];

        // 1. Initial Tokenization (preserve delimiters)
        const rawSentences = text.match(/[^.!?\n]+[.!?\n]+|[^.!?\n]+$/g) || [text];
        
        // 2. Aggressive Merge (Eliminate < 80 chars)
        let balanced = [];
        let buffer = "";

        for (let i = 0; i < rawSentences.length; i++) {
            let chunk = rawSentences[i].trim();
            if (!chunk) continue;

            if (buffer) {
                chunk = buffer + " " + chunk;
                buffer = "";
            }

            // Buffer if too short (unless it's the last one)
            if (chunk.length < 80 && i < rawSentences.length - 1) {
                buffer = chunk;
            } else {
                balanced.push(chunk);
            }
        }
        if (buffer) {
            if (balanced.length > 0) balanced[balanced.length - 1] += " " + buffer;
            else balanced.push(buffer);
        }

        // 3. Balanced Split (Break > 220 chars into EQUAL parts)
        const finalChunks = balanced.flatMap(chunk => {
             if (chunk.length <= 220) return [chunk];

             // How many pieces? e.g. 400 chars -> 3 pieces of ~133.
             // Target avg length: ~130-150 chars.
             const pieces = Math.max(2, Math.ceil(chunk.length / 140)); 
             const idealSize = chunk.length / pieces;
             
             let searchStart = 0;
             const subChunks = [];

             for (let p = 1; p < pieces; p++) {
                 // We want to split near (searchStart + idealSize)
                 const targetIdx = searchStart + idealSize;
                 
                 let splitIdx = -1;
                 let minScore = Infinity;

                 // Scan a window around target to find best break point
                 const windowSize = 50; 
                 const startScan = Math.max(searchStart + 20, Math.floor(targetIdx - windowSize));
                 const endScan = Math.min(chunk.length - 20, Math.ceil(targetIdx + windowSize));

                 for (let i = startScan; i < endScan; i++) {
                     const char = chunk[i];
                     const dist = Math.abs(i - targetIdx);
                     
                     let score = dist; // Base score is distance from ideal center
                     
                     // Bonus for punctuation (Preferred split points)
                     if (",;".includes(char)) score -= 25; 
                     if ("-—:".includes(char)) score -= 20;

                     if (score < minScore) {
                         minScore = score;
                         // If space, split AT space (exclude it). If punct, split AFTER it.
                         splitIdx = char === ' ' ? i : i + 1;
                     }
                 }

                 if (splitIdx === -1) splitIdx = Math.floor(targetIdx); // Fallback

                 subChunks.push(chunk.slice(searchStart, splitIdx).trim());
                 searchStart = splitIdx;
             }
             
             // Last piece
             subChunks.push(chunk.slice(searchStart).trim());
             return subChunks;
        });

        return finalChunks;

    }, [text]);
};
