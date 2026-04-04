/**
 * EpiTools Mathematical Library
 *
 * Core statistical functions for epidemiological calculations.
 * All functions include references to mathematical sources.
 *
 * References:
 * - Abramowitz & Stegun, "Handbook of Mathematical Functions" (1964)
 * - Peter Acklam, "An algorithm for computing the inverse normal CDF" (2003)
 * - Rothman, Greenland & Lash, "Modern Epidemiology" 3rd ed. (2008)
 * - Chow, Shao & Wang, "Sample Size Calculations in Clinical Research" 3rd ed. (2017)
 */

'use strict';

const EpiMath = (() => {

  // =========================================================================
  // Normal Distribution
  // =========================================================================

  /**
   * Standard normal cumulative distribution function (CDF).
   * Uses the Abramowitz & Stegun rational approximation (formula 26.2.17).
   * Accuracy: |error| < 7.5e-8
   *
   * Reference: Abramowitz & Stegun, Handbook of Mathematical Functions, 1964, p. 932
   *
   * @param {number} z - Z-score
   * @returns {number} P(Z <= z), the cumulative probability
   *
   * Examples:
   *   normalCDF(0)     => 0.5
   *   normalCDF(1.96)  => ~0.97500
   *   normalCDF(-1.96) => ~0.02500
   */
  function normalCDF(z) {
    if (!isFinite(z)) return z > 0 ? 1 : 0;

    // Use symmetry for negative z
    if (z < 0) return 1 - normalCDF(-z);

    // Abramowitz & Stegun constants (26.2.17)
    const p = 0.2316419;
    const b1 = 0.319381530;
    const b2 = -0.356563782;
    const b3 = 1.781477937;
    const b4 = -1.821255978;
    const b5 = 1.330274429;

    const t = 1 / (1 + p * z);
    const t2 = t * t;
    const t3 = t2 * t;
    const t4 = t3 * t;
    const t5 = t4 * t;

    const pdf = Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
    const cdf = 1 - pdf * (b1 * t + b2 * t2 + b3 * t3 + b4 * t4 + b5 * t5);

    return cdf;
  }

  /**
   * Inverse standard normal CDF (quantile function).
   * Uses Peter Acklam's rational approximation algorithm.
   * Accuracy: |error| < 1.15e-9
   *
   * Reference: Peter J. Acklam, "An algorithm for computing the inverse
   * normal cumulative distribution function" (2003)
   *
   * @param {number} p - Probability (0 < p < 1)
   * @returns {number} z-score such that P(Z <= z) = p
   * @throws {Error} If p is not in (0, 1)
   *
   * Examples:
   *   normalQuantile(0.5)    => 0
   *   normalQuantile(0.975)  => ~1.96
   *   normalQuantile(0.025)  => ~-1.96
   */
  function normalQuantile(p) {
    if (p <= 0 || p >= 1) {
      throw new Error('normalQuantile: p must be in (0, 1), got ' + p);
    }

    // Coefficients for rational approximation
    const a1 = -3.969683028665376e+01;
    const a2 = 2.209460984245205e+02;
    const a3 = -2.759285104469687e+02;
    const a4 = 1.383577518672690e+02;
    const a5 = -3.066479806614716e+01;
    const a6 = 2.506628277459239e+00;

    const b1 = -5.447609879822406e+01;
    const b2 = 1.615858368580409e+02;
    const b3 = -1.556989798598866e+02;
    const b4 = 6.680131188771972e+01;
    const b5 = -1.328068155288572e+01;

    const c1 = -7.784894002430293e-03;
    const c2 = -3.223964580411365e-01;
    const c3 = -2.400758277161838e+00;
    const c4 = -2.549732539343734e+00;
    const c5 = 4.374664141464968e+00;
    const c6 = 2.938163982698783e+00;

    const d1 = 7.784695709041462e-03;
    const d2 = 3.224671290700398e-01;
    const d3 = 2.445134137142996e+00;
    const d4 = 3.754408661907416e+00;

    const pLow = 0.02425;
    const pHigh = 1 - pLow;

    let q, r;

    if (p < pLow) {
      // Rational approximation for lower region
      q = Math.sqrt(-2 * Math.log(p));
      return (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
             ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    } else if (p <= pHigh) {
      // Rational approximation for central region
      q = p - 0.5;
      r = q * q;
      return (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q /
             (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
    } else {
      // Rational approximation for upper region
      q = Math.sqrt(-2 * Math.log(1 - p));
      return -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
              ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    }
  }

  // =========================================================================
  // Gamma / Chi-Square Distribution
  // =========================================================================

  /**
   * Natural logarithm of the gamma function.
   * Uses Lanczos approximation (g=7, n=9).
   *
   * Reference: Numerical Recipes in C, 2nd ed., section 6.1
   *
   * @param {number} x - Input value (x > 0)
   * @returns {number} ln(Gamma(x))
   */
  function lnGamma(x) {
    if (x <= 0) throw new Error('lnGamma: x must be positive, got ' + x);

    const cof = [
      676.5203681218851,
      -1259.1392167224028,
      771.32342877765313,
      -176.61502916214059,
      12.507343278686905,
      -0.13857109526572012,
      9.9843695780195716e-6,
      1.5056327351493116e-7
    ];

    let y = x;
    let tmp = x + 5.5 + 0.5;
    tmp = (x + 0.5) * Math.log(tmp) - tmp;
    let ser = 0.99999999999980993;
    for (let j = 0; j < cof.length; j++) {
      y += 1;
      ser += cof[j] / y;
    }
    return tmp + Math.log(2.5066282746310005 * ser / x);
  }

  /**
   * Regularized lower incomplete gamma function P(a, x).
   * Uses series expansion for x < a+1, continued fraction otherwise.
   *
   * Reference: Numerical Recipes in C, 2nd ed., section 6.2
   *
   * @param {number} a - Shape parameter (a > 0)
   * @param {number} x - Integration upper limit (x >= 0)
   * @returns {number} P(a, x) = gamma(a, x) / Gamma(a)
   */
  function regularizedGammaP(a, x) {
    if (x < 0) return 0;
    if (x === 0) return 0;
    if (!isFinite(x)) return 1;

    if (x < a + 1) {
      // Series expansion
      return gammaSeries(a, x);
    } else {
      // Continued fraction
      return 1 - gammaContinuedFraction(a, x);
    }
  }

  function gammaSeries(a, x) {
    const ITMAX = 200;
    const EPS = 3e-12;

    let sum = 1 / a;
    let del = sum;
    let ap = a;

    for (let n = 1; n <= ITMAX; n++) {
      ap += 1;
      del *= x / ap;
      sum += del;
      if (Math.abs(del) < Math.abs(sum) * EPS) {
        return sum * Math.exp(-x + a * Math.log(x) - lnGamma(a));
      }
    }
    return sum * Math.exp(-x + a * Math.log(x) - lnGamma(a));
  }

  function gammaContinuedFraction(a, x) {
    const ITMAX = 200;
    const EPS = 3e-12;
    const FPMIN = 1e-30;

    let b = x + 1 - a;
    let c = 1 / FPMIN;
    let d = 1 / b;
    let h = d;

    for (let i = 1; i <= ITMAX; i++) {
      const an = -i * (i - a);
      b += 2;
      d = an * d + b;
      if (Math.abs(d) < FPMIN) d = FPMIN;
      c = b + an / c;
      if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1 / d;
      const del = d * c;
      h *= del;
      if (Math.abs(del - 1) < EPS) break;
    }
    return h * Math.exp(-x + a * Math.log(x) - lnGamma(a));
  }

  /**
   * Chi-square cumulative distribution function.
   * P(X <= x) for X ~ chi-square(df).
   *
   * Uses the relationship: chiSquareCDF(x, df) = regularizedGammaP(df/2, x/2)
   *
   * Reference: Numerical Recipes in C, 2nd ed., section 6.2
   *
   * @param {number} x - Chi-square statistic (x >= 0)
   * @param {number} df - Degrees of freedom (df > 0, integer)
   * @returns {number} P(X <= x)
   *
   * Examples:
   *   chiSquareCDF(3.841, 1) => ~0.950
   *   chiSquareCDF(5.991, 2) => ~0.950
   */
  function chiSquareCDF(x, df) {
    if (x <= 0) return 0;
    if (df <= 0) throw new Error('chiSquareCDF: df must be positive');
    return regularizedGammaP(df / 2, x / 2);
  }

  /**
   * P-value from chi-square: P(X >= x) = 1 - CDF
   *
   * @param {number} x - Chi-square statistic
   * @param {number} df - Degrees of freedom
   * @returns {number} p-value (upper-tail probability)
   */
  function chiSquarePValue(x, df) {
    return 1 - chiSquareCDF(x, df);
  }

  // =========================================================================
  // Poisson Confidence Interval
  // =========================================================================

  /**
   * Exact Poisson confidence interval.
   * Uses the relationship between Poisson and chi-square distributions.
   *
   * Lower: chi-square(2k, alpha/2) / 2
   * Upper: chi-square(2(k+1), 1-alpha/2) / 2
   *
   * Implemented via inverse chi-square using bisection on regularizedGammaP.
   *
   * Reference: Rothman, Greenland & Lash, "Modern Epidemiology" 3rd ed., Ch. 14
   *
   * @param {number} k - Number of observed events (integer >= 0)
   * @param {number} alpha - Significance level (default 0.05 for 95% CI)
   * @returns {{lower: number, upper: number}} Confidence interval for the Poisson rate parameter
   *
   * Examples:
   *   poissonCI(10, 0.05) => { lower: ~4.795, upper: ~18.390 }
   */
  function poissonCI(k, alpha = 0.05) {
    if (k < 0 || !Number.isInteger(k)) {
      throw new Error('poissonCI: k must be a non-negative integer');
    }

    let lower, upper;

    if (k === 0) {
      lower = 0;
    } else {
      // Lower bound: solve regularizedGammaP(k, x/2) = alpha/2 for x, then lower = x/2
      lower = chiSquareQuantile(alpha / 2, 2 * k) / 2;
    }

    upper = chiSquareQuantile(1 - alpha / 2, 2 * (k + 1)) / 2;

    return { lower, upper };
  }

  /**
   * Inverse chi-square CDF via bisection.
   * Finds x such that chiSquareCDF(x, df) = p.
   *
   * @param {number} p - Target probability
   * @param {number} df - Degrees of freedom
   * @returns {number} x such that P(X <= x) = p
   */
  function chiSquareQuantile(p, df) {
    if (p <= 0) return 0;
    if (p >= 1) return Infinity;

    // Initial bracket
    let lo = 0;
    let hi = df + 10 * Math.sqrt(2 * df);
    // Widen upper bound if needed
    while (chiSquareCDF(hi, df) < p) {
      hi *= 2;
    }

    // Bisection
    for (let i = 0; i < 100; i++) {
      const mid = (lo + hi) / 2;
      if (chiSquareCDF(mid, df) < p) {
        lo = mid;
      } else {
        hi = mid;
      }
    }
    return (lo + hi) / 2;
  }

  // =========================================================================
  // Wilson Score Interval
  // =========================================================================

  /**
   * Wilson score confidence interval for a binomial proportion.
   *
   * Formula:
   *   (p_hat + z²/(2n) +/- z * sqrt(p_hat*(1-p_hat)/n + z²/(4n²))) / (1 + z²/n)
   *
   * Reference: Wilson, E.B. (1927). "Probable inference, the law of succession,
   * and statistical inference." JASA, 22(158), 209-212.
   *
   * @param {number} p - Observed proportion (0 <= p <= 1)
   * @param {number} n - Sample size (n > 0)
   * @param {number} alpha - Significance level (default 0.05 for 95% CI)
   * @returns {{lower: number, upper: number}} Wilson score confidence interval
   *
   * Examples:
   *   wilsonCI(0.5, 100, 0.05) => { lower: ~0.402, upper: ~0.598 }
   */
  function wilsonCI(p, n, alpha = 0.05) {
    if (n <= 0) throw new Error('wilsonCI: n must be positive');
    if (p < 0 || p > 1) throw new Error('wilsonCI: p must be in [0, 1]');

    const z = normalQuantile(1 - alpha / 2);
    const z2 = z * z;
    const denom = 1 + z2 / n;
    const center = p + z2 / (2 * n);
    const margin = z * Math.sqrt(p * (1 - p) / n + z2 / (4 * n * n));

    return {
      lower: Math.max(0, (center - margin) / denom),
      upper: Math.min(1, (center + margin) / denom)
    };
  }

  // =========================================================================
  // Fisher's Exact Test
  // =========================================================================

  /**
   * Fisher's exact test for a 2x2 contingency table.
   * Computes the two-sided p-value using the hypergeometric distribution.
   *
   * Reference: Fisher, R.A. (1922). "On the interpretation of chi-square
   * from contingency tables, and the calculation of P."
   * JRSS, 85(1), 87-94.
   *
   * @param {number} a - Cell (1,1) count
   * @param {number} b - Cell (1,2) count
   * @param {number} c - Cell (2,1) count
   * @param {number} d - Cell (2,2) count
   * @returns {number} Two-sided p-value
   *
   * Examples:
   *   fisherExact(10, 5, 2, 15) => ~0.00108 (approximately)
   */
  function fisherExact(a, b, c, d) {
    const n = a + b + c + d;
    const r1 = a + b;  // row 1 total
    const r2 = c + d;  // row 2 total
    const c1 = a + c;  // col 1 total
    const c2 = b + d;  // col 2 total

    // Log of hypergeometric probability
    function logHypergeomProb(x) {
      // P(X=x) = C(r1,x)*C(r2,c1-x)/C(n,c1)
      return (lnComb(r1, x) + lnComb(r2, c1 - x) - lnComb(n, c1));
    }

    // Log of binomial coefficient using lnGamma
    function lnComb(n, k) {
      if (k < 0 || k > n) return -Infinity;
      if (k === 0 || k === n) return 0;
      return lnGamma(n + 1) - lnGamma(k + 1) - lnGamma(n - k + 1);
    }

    const pObserved = logHypergeomProb(a);

    // Sum probabilities of all tables as or more extreme (two-sided)
    const minA = Math.max(0, c1 - r2);
    const maxA = Math.min(r1, c1);

    let pValue = 0;
    for (let x = minA; x <= maxA; x++) {
      const px = logHypergeomProb(x);
      // Include if probability <= observed (more extreme or equally extreme)
      if (px <= pObserved + 1e-10) {
        pValue += Math.exp(px);
      }
    }

    return Math.min(1, pValue);
  }

  // =========================================================================
  // Utility Functions
  // =========================================================================

  /**
   * Format a number to a specified number of decimal places.
   *
   * @param {number} value - Number to format
   * @param {number} decimals - Number of decimal places (default 4)
   * @returns {string} Formatted number string
   */
  function formatNum(value, decimals = 4) {
    if (!isFinite(value)) return String(value);
    return Number(value.toFixed(decimals)).toString();
  }

  /**
   * Validate that a value is a positive number.
   *
   * @param {*} val - Value to check
   * @param {string} name - Parameter name for error messages
   * @returns {number} The validated number
   */
  function requirePositive(val, name) {
    const n = Number(val);
    if (isNaN(n) || n <= 0) {
      throw new Error(`${name} must be a positive number, got: ${val}`);
    }
    return n;
  }

  /**
   * Validate that a value is a non-negative number.
   *
   * @param {*} val - Value to check
   * @param {string} name - Parameter name for error messages
   * @returns {number} The validated number
   */
  function requireNonNegative(val, name) {
    const n = Number(val);
    if (isNaN(n) || n < 0) {
      throw new Error(`${name} must be a non-negative number, got: ${val}`);
    }
    return n;
  }

  /**
   * Validate that a value is a probability (0 < p < 1).
   *
   * @param {*} val - Value to check
   * @param {string} name - Parameter name for error messages
   * @returns {number} The validated probability
   */
  function requireProbability(val, name) {
    const n = Number(val);
    if (isNaN(n) || n <= 0 || n >= 1) {
      throw new Error(`${name} must be between 0 and 1 (exclusive), got: ${val}`);
    }
    return n;
  }

  // =========================================================================
  // Public API
  // =========================================================================

  return {
    normalCDF,
    normalQuantile,
    chiSquareCDF,
    chiSquarePValue,
    chiSquareQuantile,
    regularizedGammaP,
    lnGamma,
    poissonCI,
    wilsonCI,
    fisherExact,
    formatNum,
    requirePositive,
    requireNonNegative,
    requireProbability
  };

})();

// Export for module environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EpiMath;
}
