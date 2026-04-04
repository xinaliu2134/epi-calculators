/**
 * EpiTools Internationalization (i18n) System
 * Supports English (en) and Chinese (zh)
 */

'use strict';

const I18n = (() => {
  const STORAGE_KEY = 'epitools-lang';

  let currentLang = localStorage.getItem(STORAGE_KEY) || 'en';

  const translations = {
    // === Common ===
    'site.title': { en: 'EpiTools', zh: 'EpiTools' },
    'site.subtitle': {
      en: 'Free Online Epidemiology & Biostatistics Calculators',
      zh: '免费在线流行病学与生物统计学计算器'
    },
    'site.credentials': {
      en: 'By Dr. Nana Liu, PhD \u2014 Erasmus MC University Medical Center Rotterdam',
      zh: '作者：刘娜娜博士 \u2014 荷兰鹿特丹伊拉斯姆斯大学医学中心'
    },
    'site.home': { en: 'Home', zh: '首页' },
    'common.calculate': { en: 'Calculate', zh: '计算' },
    'common.reset': { en: 'Reset', zh: '重置' },
    'common.results': { en: 'Results', zh: '计算结果' },
    'common.formula': { en: 'Formula', zh: '公式' },
    'common.formula_used': { en: 'Formula Used', zh: '使用的公式' },
    'common.step_by_step': { en: 'Step-by-Step Calculation', zh: '逐步计算过程' },
    'common.interpretation': { en: 'Interpretation', zh: '结果解读' },
    'common.reference': { en: 'Reference', zh: '参考文献' },
    'common.inputs': { en: 'Input Parameters', zh: '输入参数' },
    'common.disclaimer': {
      en: 'Disclaimer: This tool is for educational and research planning purposes. Always consult a biostatistician for clinical trial design.',
      zh: '免责声明：本工具仅供教育和研究规划用途。临床试验设计请务必咨询生物统计学家。'
    },
    'common.footer': {
      en: '\u00a9 2024 EpiTools by Dr. Nana Liu, PhD \u2014 Erasmus MC University Medical Center Rotterdam',
      zh: '\u00a9 2024 EpiTools \u2014 刘娜娜博士 \u2014 荷兰鹿特丹伊拉斯姆斯大学医学中心'
    },
    'common.footer_note': {
      en: 'All calculations use textbook-standard formulas. Results are verifiable against PASS, G*Power, and EpiInfo.',
      zh: '所有计算均使用教科书标准公式。结果可与 PASS、G*Power 和 EpiInfo 进行验证。'
    },
    'common.confidence_level': { en: 'Confidence Level', zh: '置信水平' },
    'common.significance_level': { en: 'Significance Level (\u03b1)', zh: '显著性水平 (\u03b1)' },
    'common.power': { en: 'Power (1\u2212\u03b2)', zh: '检验效能 (1\u2212\u03b2)' },
    'common.per_group': { en: 'per group', zh: '每组' },
    'common.total': { en: 'Total', zh: '总计' },

    // === Landing page ===
    'landing.explore': { en: 'Explore Calculators', zh: '浏览计算器' },

    // Calculator names
    'calc.sample_size': { en: 'Sample Size Calculator', zh: '样本量计算器' },
    'calc.sample_size.desc': {
      en: 'Calculate the required sample size for clinical trials comparing two proportions or two means.',
      zh: '计算临床试验中比较两个比例或两个均值所需的样本量。'
    },
    'calc.power': { en: 'Power Analysis', zh: '检验效能分析' },
    'calc.power.desc': {
      en: 'Given a sample size, calculate the statistical power of your study to detect a given effect.',
      zh: '给定样本量，计算研究检测给定效应的统计效能。'
    },
    'calc.nnt': { en: 'NNT Calculator', zh: 'NNT 计算器' },
    'calc.nnt.desc': {
      en: 'Number Needed to Treat, Absolute Risk Reduction, and Relative Risk Reduction with confidence intervals.',
      zh: '计算需治疗数、绝对风险降低和相对风险降低及其置信区间。'
    },
    'calc.or_rr': { en: 'Odds Ratio & Relative Risk', zh: '比值比与相对危险度' },
    'calc.or_rr.desc': {
      en: 'Calculate OR, RR, 95% CI, chi-square test, and Fisher\'s exact test from a 2\u00d72 table.',
      zh: '从 2\u00d72 列联表计算 OR、RR、95% CI、卡方检验和 Fisher 精确检验。'
    },
    'calc.incidence': { en: 'Incidence & Prevalence', zh: '发病率与患病率' },
    'calc.incidence.desc': {
      en: 'Calculate incidence rates, prevalence, and their confidence intervals with Poisson and Wilson methods.',
      zh: '使用 Poisson 和 Wilson 方法计算发病率、患病率及其置信区间。'
    },
    'calc.chi_square': { en: 'Chi-Square Test', zh: '卡方检验' },
    'calc.chi_square.desc': {
      en: 'Chi-square test of independence for contingency tables up to 5\u00d75, with Yates correction and Cram\u00e9r\'s V.',
      zh: '适用于最大 5\u00d75 列联表的卡方独立性检验，含 Yates 校正和 Cram\u00e9r\'s V。'
    },
    'calc.meta': { en: 'Meta-Analysis Calculator', zh: 'Meta 分析计算器' },
    'calc.meta.desc': {
      en: 'Pool effect sizes using fixed-effect and random-effects models with forest plot, Q, and I\u00b2 statistics.',
      zh: '使用固定效应和随机效应模型合并效应量，生成森林图、Q 统计量和 I\u00b2。'
    },

    'card.open': { en: 'Open Calculator \u2192', zh: '打开计算器 \u2192' },

    // === Sample Size ===
    'ss.title': { en: 'Sample Size Calculator for Clinical Trials', zh: '临床试验样本量计算器' },
    'ss.desc': { en: 'Calculate the required sample size for two-group comparisons', zh: '计算两组比较所需的样本量' },
    'ss.design': { en: 'Study Design', zh: '研究设计' },
    'ss.proportions': { en: 'Two Proportions', zh: '两个比例' },
    'ss.means': { en: 'Two Means', zh: '两个均值' },
    'ss.test_type': { en: 'Test Type', zh: '检验类型' },
    'ss.two_sided': { en: 'Two-sided', zh: '双侧' },
    'ss.one_sided': { en: 'One-sided', zh: '单侧' },
    'ss.p1': { en: 'Proportion in Control Group (p\u2081)', zh: '对照组比例 (p\u2081)' },
    'ss.p2': { en: 'Proportion in Treatment Group (p\u2082)', zh: '治疗组比例 (p\u2082)' },
    'ss.sd': { en: 'Standard Deviation (\u03c3)', zh: '标准差 (\u03c3)' },
    'ss.delta': { en: 'Minimum Detectable Difference (\u03b4)', zh: '最小可检测差异 (\u03b4)' },
    'ss.ratio': { en: 'Allocation Ratio (n\u2082/n\u2081)', zh: '分配比例 (n\u2082/n\u2081)' },
    'ss.n_per_group': { en: 'Sample Size Per Group', zh: '每组样本量' },
    'ss.n_total': { en: 'Total Sample Size', zh: '总样本量' },
    'ss.ref': {
      en: 'Chow, S.C., Shao, J. & Wang, H. (2017). Sample Size Calculations in Clinical Research, 3rd ed. Chapman & Hall/CRC.',
      zh: 'Chow, S.C., Shao, J. & Wang, H. (2017). Sample Size Calculations in Clinical Research, 3rd ed. Chapman & Hall/CRC.'
    },
    'ss.match_note': {
      en: 'Results should match PASS, G*Power, or nQuery for the same parameters.',
      zh: '在相同参数下，结果应与 PASS、G*Power 或 nQuery 一致。'
    },

    // === Power Analysis ===
    'pa.title': { en: 'Statistical Power Analysis', zh: '统计检验效能分析' },
    'pa.desc': { en: 'Given sample size, calculate the power of your study', zh: '给定样本量，计算研究的检验效能' },
    'pa.n': { en: 'Sample Size Per Group (n)', zh: '每组样本量 (n)' },
    'pa.power_result': { en: 'Statistical Power', zh: '统计检验效能' },
    'pa.power_curve': { en: 'Power Curve', zh: '效能曲线' },

    // === NNT ===
    'nnt.title': { en: 'Number Needed to Treat (NNT) Calculator', zh: '需治疗数 (NNT) 计算器' },
    'nnt.desc': { en: 'Calculate NNT, ARR, and RRR with confidence intervals', zh: '计算 NNT、ARR 和 RRR 及其置信区间' },
    'nnt.events_treatment': { en: 'Events in Treatment Group', zh: '治疗组事件数' },
    'nnt.n_treatment': { en: 'Total in Treatment Group', zh: '治疗组总人数' },
    'nnt.events_control': { en: 'Events in Control Group', zh: '对照组事件数' },
    'nnt.n_control': { en: 'Total in Control Group', zh: '对照组总人数' },
    'nnt.risk_treatment': { en: 'Risk in Treatment Group', zh: '治疗组风险' },
    'nnt.risk_control': { en: 'Risk in Control Group', zh: '对照组风险' },
    'nnt.arr': { en: 'Absolute Risk Reduction (ARR)', zh: '绝对风险降低 (ARR)' },
    'nnt.rrr': { en: 'Relative Risk Reduction (RRR)', zh: '相对风险降低 (RRR)' },
    'nnt.nnt': { en: 'Number Needed to Treat (NNT)', zh: '需治疗数 (NNT)' },
    'nnt.nnh': { en: 'Number Needed to Harm (NNH)', zh: '需危害数 (NNH)' },
    'nnt.ref': {
      en: 'Altman, D.G. (1998). "Confidence intervals for the number needed to treat." BMJ, 317(7168), 1309-1312.',
      zh: 'Altman, D.G. (1998). "Confidence intervals for the number needed to treat." BMJ, 317(7168), 1309-1312.'
    },

    // === OR/RR ===
    'or.title': { en: 'Odds Ratio & Relative Risk Calculator', zh: '比值比与相对危险度计算器' },
    'or.desc': { en: 'Calculate OR, RR, and tests of association from a 2\u00d72 table', zh: '从 2\u00d72 列联表计算 OR、RR 及关联性检验' },
    'or.exposed': { en: 'Exposed', zh: '暴露' },
    'or.unexposed': { en: 'Unexposed', zh: '未暴露' },
    'or.disease_pos': { en: 'Disease +', zh: '疾病 +' },
    'or.disease_neg': { en: 'Disease \u2212', zh: '疾病 \u2212' },
    'or.or_label': { en: 'Odds Ratio (OR)', zh: '比值比 (OR)' },
    'or.rr_label': { en: 'Relative Risk (RR)', zh: '相对危险度 (RR)' },
    'or.chi2': { en: 'Chi-Square Statistic', zh: '卡方统计量' },
    'or.p_value': { en: 'Chi-Square p-value', zh: '卡方 p 值' },
    'or.fisher_p': { en: "Fisher's Exact p-value", zh: 'Fisher 精确检验 p 值' },
    'or.ref': {
      en: 'Rothman, K.J., Greenland, S. & Lash, T.L. (2008). Modern Epidemiology, 3rd ed. Lippincott Williams & Wilkins.',
      zh: 'Rothman, K.J., Greenland, S. & Lash, T.L. (2008). Modern Epidemiology, 3rd ed. Lippincott Williams & Wilkins.'
    },

    // === Incidence/Prevalence ===
    'ip.title': { en: 'Incidence & Prevalence Calculator', zh: '发病率与患病率计算器' },
    'ip.desc': { en: 'Calculate incidence rates and prevalence with confidence intervals', zh: '计算发病率和患病率及其置信区间' },
    'ip.calc_type': { en: 'Calculation Type', zh: '计算类型' },
    'ip.incidence_rate': { en: 'Incidence Rate', zh: '发病率' },
    'ip.prevalence': { en: 'Prevalence', zh: '患病率' },
    'ip.new_cases': { en: 'Number of New Cases', zh: '新发病例数' },
    'ip.person_time': { en: 'Person-Time at Risk', zh: '危险人时' },
    'ip.existing_cases': { en: 'Number of Existing Cases', zh: '现有病例数' },
    'ip.total_pop': { en: 'Total Population', zh: '总人口数' },
    'ip.multiplier': { en: 'Rate Multiplier', zh: '率的乘数' },
    'ip.ref': {
      en: 'Rothman, K.J., Greenland, S. & Lash, T.L. (2008). Modern Epidemiology, 3rd ed., Ch. 3.',
      zh: 'Rothman, K.J., Greenland, S. & Lash, T.L. (2008). Modern Epidemiology, 3rd ed., Ch. 3.'
    },

    // === Chi-Square ===
    'chi.title': { en: 'Chi-Square Test Calculator', zh: '卡方检验计算器' },
    'chi.desc': { en: 'Chi-square test of independence for contingency tables', zh: '列联表独立性卡方检验' },
    'chi.rows': { en: 'Number of Rows', zh: '行数' },
    'chi.cols': { en: 'Number of Columns', zh: '列数' },
    'chi.generate': { en: 'Generate Table', zh: '生成表格' },
    'chi.chi2': { en: 'Chi-Square Statistic (\u03c7\u00b2)', zh: '卡方统计量 (\u03c7\u00b2)' },
    'chi.yates': { en: 'Chi-Square with Yates Correction', zh: 'Yates 校正卡方值' },
    'chi.df': { en: 'Degrees of Freedom', zh: '自由度' },
    'chi.p_value': { en: 'p-value', zh: 'p 值' },
    'chi.cramers_v': { en: "Cram\u00e9r's V", zh: "Cram\u00e9r's V" },
    'chi.expected': { en: 'Expected Frequencies', zh: '期望频数' },
    'chi.ref': {
      en: 'Agresti, A. (2013). Categorical Data Analysis, 3rd ed. Wiley.',
      zh: 'Agresti, A. (2013). Categorical Data Analysis, 3rd ed. Wiley.'
    },

    // === Meta-Analysis ===
    'meta.title': { en: 'Meta-Analysis Effect Size Calculator', zh: 'Meta 分析效应量计算器' },
    'meta.desc': { en: 'Pool effect sizes with fixed and random-effects models', zh: '使用固定效应和随机效应模型合并效应量' },
    'meta.input_type': { en: 'Input Type', zh: '输入类型' },
    'meta.or_ci': { en: 'OR with 95% CI', zh: 'OR 及 95% CI' },
    'meta.rr_ci': { en: 'RR with 95% CI', zh: 'RR 及 95% CI' },
    'meta.md_ci': { en: 'Mean Difference with 95% CI', zh: '均值差及 95% CI' },
    'meta.study_name': { en: 'Study', zh: '研究' },
    'meta.effect': { en: 'Effect Size', zh: '效应量' },
    'meta.lower_ci': { en: 'Lower CI', zh: 'CI 下限' },
    'meta.upper_ci': { en: 'Upper CI', zh: 'CI 上限' },
    'meta.add_study': { en: '+ Add Study', zh: '+ 添加研究' },
    'meta.remove_study': { en: 'Remove', zh: '删除' },
    'meta.fixed': { en: 'Fixed-Effect (Inverse Variance)', zh: '固定效应 (逆方差法)' },
    'meta.random': { en: 'Random-Effects (DerSimonian-Laird)', zh: '随机效应 (DerSimonian-Laird)' },
    'meta.pooled_effect': { en: 'Pooled Effect Size', zh: '合并效应量' },
    'meta.q_stat': { en: 'Cochran\'s Q', zh: 'Cochran Q 统计量' },
    'meta.i_squared': { en: 'I\u00b2 (Heterogeneity)', zh: 'I\u00b2 (异质性)' },
    'meta.tau_squared': { en: '\u03c4\u00b2', zh: '\u03c4\u00b2' },
    'meta.forest_plot': { en: 'Forest Plot', zh: '森林图' },
    'meta.ref': {
      en: 'DerSimonian, R. & Laird, N. (1986). "Meta-analysis in clinical trials." Controlled Clinical Trials, 7(3), 177-188.',
      zh: 'DerSimonian, R. & Laird, N. (1986). "Meta-analysis in clinical trials." Controlled Clinical Trials, 7(3), 177-188.'
    }
  };

  /**
   * Get translated string for the given key.
   * @param {string} key - Translation key
   * @returns {string} Translated string
   */
  function t(key) {
    const entry = translations[key];
    if (!entry) return key;
    return entry[currentLang] || entry['en'] || key;
  }

  /**
   * Get current language code.
   * @returns {string} 'en' or 'zh'
   */
  function getLang() {
    return currentLang;
  }

  /**
   * Set language and persist.
   * @param {string} lang - 'en' or 'zh'
   */
  function setLang(lang) {
    if (lang !== 'en' && lang !== 'zh') return;
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
  }

  /**
   * Toggle language between en and zh.
   */
  function toggleLang() {
    setLang(currentLang === 'en' ? 'zh' : 'en');
  }

  /**
   * Apply translations to all elements with data-i18n attribute.
   * Use data-i18n="key" on elements.
   * Use data-i18n-placeholder="key" for input placeholders.
   * Use data-i18n-title="key" for title attributes.
   */
  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = t(key);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.value = text;
      } else {
        el.textContent = text;
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      el.title = t(el.getAttribute('data-i18n-title'));
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      el.innerHTML = t(el.getAttribute('data-i18n-html'));
    });

    // Update lang attribute
    document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';

    // Update toggle button text
    const toggleBtn = document.getElementById('lang-toggle');
    if (toggleBtn) {
      toggleBtn.textContent = currentLang === 'en' ? '中文' : 'English';
    }
  }

  /**
   * Initialize i18n: apply translations and set up toggle button.
   */
  function init() {
    applyTranslations();

    const toggleBtn = document.getElementById('lang-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        toggleLang();
        applyTranslations();
        // Fire custom event so pages can re-render dynamic content
        document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: currentLang } }));
      });
    }
  }

  return { t, getLang, setLang, toggleLang, applyTranslations, init };
})();
