import React from 'react';
import { InfoIcon } from '../InfoIcon';

interface TypeProfile {
  code: string;
  name: string;
  nickname: string;
  icon: string;
  shortDescription: string;
  fullDescription: string;
  cognitiveFunctions: string[];
  strengths: string[];
  weaknesses: string[];
  careers: string[];
  populationPercentage: string;
}

const typeProfiles: Record<string, TypeProfile> = {
  ISTJ: {
    code: 'ISTJ', name: '检查者', nickname: '值得信赖的守护者', icon: '📋',
    shortDescription: '安静、严肃，通过全面和可靠来获得成功。实际、负责任、务实。',
    fullDescription: 'ISTJ型人格是最负责任、最可靠的类型之一。他们重视传统和忠诚，以事实为导向，做事有条不紊。他们是出色的组织者，善于创建和维护秩序，确保规则被遵守，任务按时完成。',
    cognitiveFunctions: ['Si (内向实感)', 'Te (外向思考)', 'Fi (内向情感)', 'Ne (外向直觉)'],
    strengths: ['诚实可靠', '意志坚强', '责任心强', '冷静理性', '注重细节'],
    weaknesses: ['固执己见', '不善表达情感', '过于守旧', '对变化适应较慢'],
    careers: ['会计师', '审计师', '项目经理', '系统管理员', '法律工作者', '军事人员'],
    populationPercentage: '11-14%',
  },
  ISFJ: {
    code: 'ISFJ', name: '守护者', nickname: '忠诚的保护者', icon: '🛡️',
    shortDescription: '安静、友善、负责任、认真。始终如一地满足自己的义务。',
    fullDescription: 'ISFJ型人格是最体贴、最忠诚的类型。他们重视和谐与合作，总是关注他人的需求和感受。他们有出色的记忆力，能记住他们关心的人的重要细节。',
    cognitiveFunctions: ['Si (内向实感)', 'Fe (外向情感)', 'Ti (内向思考)', 'Ne (外向直觉)'],
    strengths: ['支持他人', '耐心细致', '善于观察', '可靠忠诚', '热心助人'],
    weaknesses: ['过度谦虚', '不善拒绝', '压抑情感', '抵触变化'],
    careers: ['护士', '教师', '社工', '行政助理', '图书管理员', '人力资源专员'],
    populationPercentage: '9-14%',
  },
  INFJ: {
    code: 'INFJ', name: '提倡者', nickname: '有远见的理想主义者', icon: '🌟',
    shortDescription: '追求意义和联系，有洞察力，希望理解什么能激励人们。',
    fullDescription: 'INFJ是最稀有的人格类型之一，有着深刻的洞察力和强烈的价值观。他们既有理想主义的愿景，又有将愿景付诸实践的决心。他们是天生的辅导者和倡导者。',
    cognitiveFunctions: ['Ni (内向直觉)', 'Fe (外向情感)', 'Ti (内向思考)', 'Se (外向实感)'],
    strengths: ['洞察力强', '理想主义', '有决心', '善于启发他人', '富有同情心'],
    weaknesses: ['完美主义', '过度敏感', '不喜冲突', '容易倦怠'],
    careers: ['心理咨询师', '作家', '教育工作者', '非营利组织管理者', '人力资源总监'],
    populationPercentage: '1-3%',
  },
  INTJ: {
    code: 'INTJ', name: '建筑师', nickname: '战略思想家', icon: '🏗️',
    shortDescription: '具有独创性的思想和极大的驱动力来实现自己的想法和目标。',
    fullDescription: 'INTJ型人格是最独立和最有战略眼光的类型。他们是天生的问题解决者，善于看到大局并制定长期计划。他们重视能力和知识，追求不断改进和优化。',
    cognitiveFunctions: ['Ni (内向直觉)', 'Te (外向思考)', 'Fi (内向情感)', 'Se (外向实感)'],
    strengths: ['战略思维', '独立自主', '有决心', '求知欲强', '高标准'],
    weaknesses: ['过度批判', '过于独立', '不善表达情感', '完美主义'],
    careers: ['科学家', '系统架构师', '投资分析师', '管理顾问', '大学教授'],
    populationPercentage: '2-4%',
  },
  ISTP: {
    code: 'ISTP', name: '鉴赏家', nickname: '灵巧的工匠', icon: '🔧',
    shortDescription: '灵活、宽容，安静地观察直到问题出现，然后迅速找到可行的解决方案。',
    fullDescription: 'ISTP型人格是最擅长动手解决问题的类型。他们对事物的运作方式有天生的好奇心，喜欢拆解和重组事物。他们冷静理性，在危机中表现出色。',
    cognitiveFunctions: ['Ti (内向思考)', 'Se (外向实感)', 'Ni (内向直觉)', 'Fe (外向情感)'],
    strengths: ['动手能力强', '理性冷静', '适应力强', '善于解决问题', '独立自主'],
    weaknesses: ['情感表达少', '容易冒险', '不喜承诺', '可能不够敏感'],
    careers: ['工程师', '技术员', '飞行员', '消防员', '法医', '运动员'],
    populationPercentage: '4-6%',
  },
  ISFP: {
    code: 'ISFP', name: '探险家', nickname: '灵活的艺术家', icon: '🎨',
    shortDescription: '安静、友善、敏感、善良。享受当下，享受周围发生的事情。',
    fullDescription: 'ISFP型人格是最具艺术气质和审美感的类型。他们对美有天生的敏感度，喜欢通过实际体验来探索世界。他们温柔善良，重视个人价值观。',
    cognitiveFunctions: ['Fi (内向情感)', 'Se (外向实感)', 'Ni (内向直觉)', 'Te (外向思考)'],
    strengths: ['审美能力强', '善良体贴', '灵活适应', '忠于自我', '实践能力强'],
    weaknesses: ['过度敏感', '不善规划', '回避冲突', '缺乏远见'],
    careers: ['设计师', '摄影师', '音乐家', '兽医', '厨师', '护理师'],
    populationPercentage: '5-9%',
  },
  INFP: {
    code: 'INFP', name: '调停者', nickname: '理想主义的治愈者', icon: '🌈',
    shortDescription: '理想主义者，对自己重视的人或事业忠诚，追求与价值观一致的生活。',
    fullDescription: 'INFP型人格是最理想主义和最有同理心的类型。他们有着丰富的内心世界，渴望为世界带来积极的改变。他们是出色的倾听者和创意思考者。',
    cognitiveFunctions: ['Fi (内向情感)', 'Ne (外向直觉)', 'Si (内向实感)', 'Te (外向思考)'],
    strengths: ['同理心强', '创造力丰富', '热情投入', '忠于价值观', '适应力强'],
    weaknesses: ['过度理想化', '不切实际', '过度敏感', '自我批评'],
    careers: ['作家', '心理咨询师', '社会工作者', '教师', '翻译', '人文学者'],
    populationPercentage: '4-5%',
  },
  INTP: {
    code: 'INTP', name: '逻辑学家', nickname: '客观的分析者', icon: '🧩',
    shortDescription: '追求对任何感兴趣的事物建立逻辑解释。理论性强，抽象思维能力出色。',
    fullDescription: 'INTP型人格是最具分析能力和创新思维的类型。他们对知识有无穷的渴望，善于发现模式和不一致之处。他们独立思考，不轻易接受传统观念。',
    cognitiveFunctions: ['Ti (内向思考)', 'Ne (外向直觉)', 'Si (内向实感)', 'Fe (外向情感)'],
    strengths: ['分析能力强', '创新思维', '客观公正', '求知欲旺盛', '独立思考'],
    weaknesses: ['社交能力弱', '过度分析', '忽视情感', '难以执行'],
    careers: ['程序员', '数学家', '哲学家', '物理学家', '系统分析师', '研究员'],
    populationPercentage: '3-5%',
  },
  ESTP: {
    code: 'ESTP', name: '企业家', nickname: '精力充沛的行动者', icon: '⚡',
    shortDescription: '灵活、宽容、务实。专注于获取即时的结果，享受当下。',
    fullDescription: 'ESTP型人格是最有活力和最务实的类型。他们喜欢行动，善于即兴发挥，能在瞬间做出准确的判断。他们是天生的谈判者和问题解决者。',
    cognitiveFunctions: ['Se (外向实感)', 'Ti (内向思考)', 'Fe (外向情感)', 'Ni (内向直觉)'],
    strengths: ['行动力强', '适应力强', '社交能力好', '务实高效', '善于观察'],
    weaknesses: ['缺乏耐心', '冒险倾向', '忽视长期计划', '不善处理情感'],
    careers: ['销售经理', '企业家', '运动教练', '急救人员', '警察', '市场营销'],
    populationPercentage: '4-5%',
  },
  ESFP: {
    code: 'ESFP', name: '表演者', nickname: '热情的娱乐家', icon: '🎭',
    shortDescription: '外向、友好、接受。热爱生活、人和物质享受。',
    fullDescription: 'ESFP型人格是最有感染力和最热情的类型。他们天生善于社交，能让周围的人感到快乐和舒适。他们活在当下，善于享受生活中的每一刻。',
    cognitiveFunctions: ['Se (外向实感)', 'Fi (内向情感)', 'Te (外向思考)', 'Ni (内向直觉)'],
    strengths: ['热情开朗', '善于社交', '实践能力强', '适应力好', '慷慨大方'],
    weaknesses: ['不善规划', '容易分心', '回避冲突', '过度乐观'],
    careers: ['演员', '活动策划', '旅游顾问', '销售代表', '公关专员', '健身教练'],
    populationPercentage: '4-9%',
  },
  ENFP: {
    code: 'ENFP', name: '竞选者', nickname: '热情的创新者', icon: '🦋',
    shortDescription: '热情有想象力，视生活充满可能性。善于联想，自信大胆。',
    fullDescription: 'ENFP型人格是最有创意和最具感染力的类型。他们对新想法和可能性充满热情，善于激励他人。他们有着丰富的想象力和强烈的好奇心。',
    cognitiveFunctions: ['Ne (外向直觉)', 'Fi (内向情感)', 'Te (外向思考)', 'Si (内向实感)'],
    strengths: ['创造力强', '热情洋溢', '善于沟通', '适应力好', '洞察力强'],
    weaknesses: ['难以集中', '过度理想化', '容易焦虑', '不善跟进'],
    careers: ['记者', '咨询顾问', '创意总监', '培训师', '心理学家', '创业者'],
    populationPercentage: '6-8%',
  },
  ENTP: {
    code: 'ENTP', name: '辩论家', nickname: '聪明的探索者', icon: '💡',
    shortDescription: '聪明、好奇，善于快速生成解决方案。喜欢分析和辩论。',
    fullDescription: 'ENTP型人格是最善于辩论和创新的类型。他们对任何问题都能提出独特的观点和解决方案。他们思维敏捷，喜欢挑战传统观念和现有规则。',
    cognitiveFunctions: ['Ne (外向直觉)', 'Ti (内向思考)', 'Fe (外向情感)', 'Si (内向实感)'],
    strengths: ['思维敏捷', '创新能力强', '知识渊博', '善于辩论', '适应力强'],
    weaknesses: ['争论性强', '不善跟进', '对细节不耐烦', '可能不够敏感'],
    careers: ['律师', '发明家', '企业家', '政治家', '管理顾问', '产品经理'],
    populationPercentage: '2-5%',
  },
  ESTJ: {
    code: 'ESTJ', name: '总经理', nickname: '高效的组织者', icon: '👔',
    shortDescription: '务实、现实、果断。善于组织项目和人员，专注于高效完成任务。',
    fullDescription: 'ESTJ型人格是最善于组织和管理的类型。他们天生具有领导力，善于建立秩序和推动执行。他们重视传统、稳定和明确的规则。',
    cognitiveFunctions: ['Te (外向思考)', 'Si (内向实感)', 'Ne (外向直觉)', 'Fi (内向情感)'],
    strengths: ['组织能力强', '务实高效', '责任心强', '领导力好', '意志坚定'],
    weaknesses: ['过于固执', '不善表达情感', '过于注重规则', '批判性强'],
    careers: ['企业管理者', '法官', '财务总监', '军官', '学校校长', '项目总监'],
    populationPercentage: '8-12%',
  },
  ESFJ: {
    code: 'ESFJ', name: '执政官', nickname: '热心的照顾者', icon: '🤝',
    shortDescription: '热心肠、尽责、合作。希望周围的人和谐，积极营造友好的环境。',
    fullDescription: 'ESFJ型人格是最善于关怀他人和维护社会秩序的类型。他们忠诚、体贴，总是准备好帮助需要的人。他们重视和谐和传统，善于创建温暖的社区氛围。',
    cognitiveFunctions: ['Fe (外向情感)', 'Si (内向实感)', 'Ne (外向直觉)', 'Ti (内向思考)'],
    strengths: ['善于关怀', '忠诚可靠', '组织能力好', '社交能力强', '实践性强'],
    weaknesses: ['过于在意他人看法', '不善处理批评', '过于控制', '抵触变化'],
    careers: ['医生', '教师', '社区管理者', '客户经理', '活动策划', '护士长'],
    populationPercentage: '9-13%',
  },
  ENFJ: {
    code: 'ENFJ', name: '主人公', nickname: '魅力四射的领导者', icon: '🌍',
    shortDescription: '温暖、有同理心、反应灵敏、负责任。天生的领导者和激励者。',
    fullDescription: 'ENFJ型人格是最具魅力和影响力的类型。他们天生善于理解和激励他人，有着强烈的使命感和社会责任感。他们是出色的沟通者和团队建设者。',
    cognitiveFunctions: ['Fe (外向情感)', 'Ni (内向直觉)', 'Se (外向实感)', 'Ti (内向思考)'],
    strengths: ['领导力强', '善于激励', '同理心强', '沟通能力好', '有远见'],
    weaknesses: ['过度付出', '过于理想化', '自我批评', '难以做困难决定'],
    careers: ['CEO', '政治家', '教育家', '心理咨询师', '人力资源总监', '外交官'],
    populationPercentage: '2-5%',
  },
  ENTJ: {
    code: 'ENTJ', name: '指挥官', nickname: '果断的战略家', icon: '👑',
    shortDescription: '坦率、果断，天生的领导者。善于看到不合理的程序和政策并加以改进。',
    fullDescription: 'ENTJ型人格是最具领导力和战略思维的类型。他们天生善于规划和执行，能够将愿景转化为现实。他们追求效率和卓越，不断推动自己和团队前进。',
    cognitiveFunctions: ['Te (外向思考)', 'Ni (内向直觉)', 'Se (外向实感)', 'Fi (内向情感)'],
    strengths: ['领导力强', '战略思维', '自信果断', '效率至上', '意志坚定'],
    weaknesses: ['过于强势', '缺乏耐心', '情感表达少', '过于批判'],
    careers: ['CEO', '企业家', '管理顾问', '律师', '大学教授', '投资银行家'],
    populationPercentage: '1-4%',
  },
};

interface TypeCardProps {
  typeCode: string;
}

const TypeCard: React.FC<TypeCardProps> = ({ typeCode }) => {
  const profile = typeProfiles[typeCode];

  if (!profile) {
    return (
      <div className="excalidraw-card bg-gradient-to-br from-purple-50 to-indigo-50 text-center p-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">{typeCode}</h2>
        <p className="text-gray-600">类型详情加载中...</p>
      </div>
    );
  }

  return (
    <div className="excalidraw-card bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Type Header */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-3">{profile.icon}</div>
        <h2 className="text-5xl font-bold text-purple-800 mb-2">{profile.code}</h2>
        <p className="text-2xl font-semibold text-gray-800">{profile.name}</p>
        <p className="text-lg text-indigo-600 italic mt-1">{profile.nickname}</p>
        <p className="text-sm text-gray-500 mt-2">约占人口的 {profile.populationPercentage}</p>
      </div>

      {/* Short Description */}
      <div className="bg-white p-4 rounded-xl border-2 border-purple-200 mb-4">
        <p className="text-gray-700 leading-relaxed text-center">{profile.shortDescription}</p>
      </div>

      {/* Full Description */}
      <div className="bg-white p-4 rounded-xl border-2 border-gray-200 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-bold text-gray-800">详细描述</h3>
          <InfoIcon
            title="类型描述"
            content="这是对您MBTI人格类型的综合性描述，基于四个维度偏好的独特组合，展现您在认知、决策和行为方面的典型特征。"
          />
        </div>
        <p className="text-gray-700 leading-relaxed">{profile.fullDescription}</p>
      </div>

      {/* Cognitive Functions */}
      <div className="bg-white p-4 rounded-xl border-2 border-indigo-200 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="font-bold text-gray-800">🧠 认知功能栈</h3>
          <InfoIcon
            title="认知功能"
            content="认知功能栈描述了您处理信息和做出决策的优先方式。排列顺序从主导功能（最自然使用）到劣势功能（最不自然使用），了解您的功能栈有助于深入理解自己的思维方式。"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {profile.cognitiveFunctions.map((fn, idx) => (
            <div key={idx} className={`p-2 rounded-lg border text-center text-sm ${
              idx === 0 ? 'bg-purple-100 border-purple-300 font-semibold' :
              idx === 1 ? 'bg-indigo-50 border-indigo-200' :
              idx === 2 ? 'bg-blue-50 border-blue-200' :
              'bg-gray-50 border-gray-200'
            }`}>
              <span className="text-xs text-gray-500 block">
                {idx === 0 ? '主导' : idx === 1 ? '辅助' : idx === 2 ? '第三' : '劣势'}
              </span>
              {fn}
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-4 rounded-xl border-2 border-green-200">
          <h3 className="font-bold text-green-800 mb-2">✨ 优势</h3>
          <ul className="space-y-1">
            {profile.strengths.map((s, idx) => (
              <li key={idx} className="text-gray-700 text-sm flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-4 rounded-xl border-2 border-orange-200">
          <h3 className="font-bold text-orange-800 mb-2">⚡ 成长空间</h3>
          <ul className="space-y-1">
            {profile.weaknesses.map((w, idx) => (
              <li key={idx} className="text-gray-700 text-sm flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">!</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Career Recommendations */}
      <div className="bg-white p-4 rounded-xl border-2 border-purple-200">
        <h3 className="font-bold text-purple-800 mb-2">💼 推荐职业方向</h3>
        <div className="flex flex-wrap gap-2">
          {profile.careers.map((career, idx) => (
            <span key={idx} className="px-3 py-1 bg-purple-50 border-2 border-purple-300 rounded-full text-sm text-purple-700">
              {career}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypeCard;
