import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ArrowRight, Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// --- i18n ---
type Lang = 'en' | 'zh';

const t = {
  nav: {
    about: { en: 'About', zh: '关于' },
    experience: { en: 'Experience', zh: '经历' },
    projects: { en: 'Projects', zh: '项目' },
    skills: { en: 'Skills', zh: '技能' },
    contact: { en: 'Contact', zh: '联系' },
    resume: { en: 'Resume', zh: '简历' },
  },
  hero: {
    line1: { en: "Don't just plan,", zh: '不止于计划，' },
    line2: { en: 'create!', zh: '去创造！' },

    typewriter: { en: "change is the end result of all true learning.", zh: '改变，是所有真正学习的终点。' },
    cta: { en: 'View Portfolio', zh: '查看作品集' },
  },
  about: {
    hi: { en: 'Hi, my name is', zh: '你好，我是' },
    name: { en: 'ZiYun Zeng — AI Builder.', zh: '曾紫云 — AI Builder' },
    nameSub: { en: '', zh: '剪视频也会vibe coding' },
    tagline: { en: 'Crafting digital experiences with precision and passion.', zh: '做视频也写代码，把每个细节打磨到让自己满意。' },
    bio: {
      en: "I started as a video editor with two years of hands-on experience. Then I embraced the AI wave, joined the AIDM program, and shifted my focus toward coding and development. Today, I'm a multidisciplinary creator who bridges storytelling and technology — and my ultimate goal is to craft work that makes people say \"wow\". I want to build digital experiences that strike straight at the heart.",
      zh: '做了两年视频剪辑，正好赶上AI这波浪潮，于是加入香港浸会大学学习人工智能与数码媒体专业。现在算半个剪辑师半个开发者——我可以用视频讲故事，也喜欢用vibe coding把想法做出来，我追求创造让人看了会说wow的内容。',
    },
    phone: { en: 'Phone: 15013323642', zh: '电话：15013323642' },
    github: { en: 'GitHub: @purplecloud0342-source', zh: 'GitHub：@purplecloud0342-source' },
    btn1: { en: 'View My Work', zh: '查看作品' },
    btn2: { en: 'CV', zh: '简历' },
  },
  experience: {
    heading: { en: 'Experience', zh: '经历' },
    items: [
      { role: { en: 'AI Builder', zh: 'AI Builder' }, org: 'HKBU', period: { en: '2025 — Present', zh: '2025 — 至今' }, desc: { en: 'Building AI products from 0 to 1 — multi-agent browser extensions, career exploration platforms, AIGC video experiments. Turning ideas into working products through vibe coding and rapid prototyping.', zh: '从 0 到 1 构建 AI 产品——多 Agent 浏览器扩展、职业探索平台、AIGC 视频实验。用 vibe coding 和快速原型把想法变成能跑的产品。' } },
      { role: { en: 'Video Editor & Colorist', zh: '视频剪辑 & 调色' }, org: 'Beijing Yingmei', period: { en: '2024 — 2025', zh: '2024 — 2025' }, desc: { en: 'Independently delivered commercial projects end-to-end — product ads, brand campaigns, narrative microfilms. One person, full post-production pipeline, from raw footage to finished commercial.', zh: '独立交付商业项目——产品广告、品牌广告、叙事微电影。从素材到成片，一个人走完全部后期流程。' } },
      { role: { en: 'Data Analysis Intern', zh: '数据分析实习' }, org: '', period: { en: '2023 — 2024', zh: '2023 — 2024' }, desc: { en: 'Analyzed academic performance data for multiple Beijing schools. Turned grade distributions into actionable insights — identifying weak spots and helping schools adjust teaching strategies.', zh: '为北京多所初高中做成绩数据分析。从分数分布中识别薄弱环节，输出分析报告协助校方制定教学改进方案。' } },
    ],
  },
  projects: {
    heading: { en: 'Projects', zh: '项目作品' },
    intro: { en: 'From video editing to AI development — every project here started with a question I wanted to figure out.', zh: '从视频剪辑跨到 AI 开发，每个项目都来源于一个自己想搞清楚的问题。' },
    items: [
      {
        group: 'ai',
        title: { en: 'AI Storyboard', zh: 'AI 故事板' },
        role: { en: 'Agent System + Full-Stack', zh: 'Agent 系统设计 + 全栈' },
        year: '2026',
        images: ['/images/story board2.jpg', '/images/storyboard.jpg', '/images/story board3.jpg'],
        image: '/images/story board2.jpg',
        desc: { en: "Insight: After researching video creators' workflows, I found the biggest time loss isn't creativity but the friction of starting from a blank page.\n\nSolution: A multi-agent system that generates scripts and storyboard previews from an idea — three specialized Agents (Scriptwriter → Storyboard → Visual) collaborate in a pipeline, each evaluated independently. Turns LLM APIs into a tool creators can actually use.", zh: '洞察：调研视频创作者流程后发现，真正花时间的不是创意本身，而是从零到一的启动摩擦。\n\n方案：一个输入想法自动出剧本和分镜画面的多 Agent 系统。三个专职 Agent（编剧 → 分镜 → 视觉）协作编排，每个环节可独立评测。把 LLM API 编排成创作者真正用得上的工具。' },
        tags: ['Multi-Agent', 'LLM API', 'React', 'TypeScript', 'Vite'],
      },
      {
        group: 'ai',
        title: { en: '问津', zh: '问津' },
        role: { en: 'Product Design + Full-Stack', zh: '产品设计 + 独立全栈' },
        year: '2026',
        image: '/images/project4.png',
        webUrl: 'https://b9d30e9d.wenjin-4xc.pages.dev/work',
        desc: { en: "Insight: Career assessment tools stop at personality labels. The real gap is the bridge between self-knowledge and action.\n\nSolution: A career exploration platform disguised as a 6-chapter book (Self-Portrait → Algorithm Match → Free Explore → 5-Year Timeline → Action List → Fork Reflection). 533 occupations hand-curated into a structured database, each paired with concrete first steps. From user insight to independent full-stack delivery — one person, end to end.", zh: '洞察：市面职业测评止步于性格标签，真正的缺口在「认识自己」到「采取行动」之间的桥。\n\n方案：一个伪装成 6 章书的职业探索平台（自画像 → 算法匹配 → 自由探索 → 5年时间线 → 行动清单 → 岔路口反思）。533 个职业手动结构化，每个附带可执行的下一步。从需求洞察到独立全栈交付，一个人走完了全程。' },
        tags: ['React', 'TypeScript', '产品设计', '全栈开发', 'Cloudflare Pages'],
      },
      {
        group: 'ai',
        title: { en: "AI's Hidden Cost", zh: 'AI 背后的隐形成本' },
        role: { en: 'Web Dev + Data Storytelling', zh: 'Web 开发 + 数据叙事' },
        year: '2026',
        image: '/images/project4_1.png',
        webUrl: 'https://7350final-4lt8.vercel.app/',
        desc: { en: "Insight: Most users have no mental model for the resource costs behind AI interactions — abstract numbers like '17 million liters of water' don't land.\n\nSolution: A scroll-driven narrative page translating Token consumption into everyday units (bottles of water, kilowatt-hours, hours of human labor). Using the web as a storytelling medium: no dashboards, just a narrative that unfolds as you scroll — letting facts speak and users draw their own conclusions.", zh: '洞察：普通用户对 AI 背后的资源代价几乎没有感知——「1700 万升水」这种抽象数字看了无感。\n\n方案：一个把 Token 消耗换算为日常单位的滚动叙事网页（一瓶水、一度电、一个人工作几小时）。把网页当叙事媒介用：不靠仪表盘，靠滚动讲述一个完整的故事——把事实放在那，让用户自己得出结论。' },
        tags: ['HTML/CSS/JS', '数据可视化', '叙事设计', 'Vercel'],
      },
      {
        group: 'video',
        title: { en: 'Minions × Friends — IP Mashup', zh: '小黄人版老友记 AIGC视频' },
        role: { en: 'Content Strategy + AIGC', zh: '内容策略 + AIGC 制作' },
        year: '2026',
        image: '/images/小黄人版老友记-封面.jpg',
        videoUrl: '//player.bilibili.com/player.html?bvid=BV1nf6DBjE6f&page=1&high_quality=1&danmaku=0',
        desc: { en: "Strategy: An IP mashup × AIGC experiment. Based on the insight that classic IP mashups carry their own virality, the concept paired Friends' scenario DNA with Minions' visual identity — finding the right ratio (70% Friends scenes + 30% Minions traits) was key to making the mashup recognizable but fresh.\n\nAIGC Pipeline: 31 clips generated across multiple AI platforms (Midjourney for character design → Runway for motion → Kling for facial detail). A visual anchor strategy — fixing three visual traits per character — combated style drift and pushed usable footage from 40% to 75%.\n\nResults: 9,863 views and 1,564 likes on Xiaohongshu, validating the core judgment: a strong creative combo with decent execution beats flashy AI effects without viral DNA.", zh: '策略判断：一次 IP 混搭 × AIGC 的内容实验。基于「经典 IP 混搭自带传播力」的判断，锁定老友记场景 DNA + 小黄人视觉特征的组合。关键决策——锁定「70% 老友记场景 + 30% 小黄人特征」的配比，既有辨识度又有新鲜感。\n\nAIGC 管线：跨 Midjourney（角色设计）→ Runway（动态生成）→ 可灵（表情细节）三个平台生成 31 段素材。用视觉锚点策略——每个角色固定三个视觉特征——对抗风格漂移，可用素材率从 40% 拉到 75%。\n\n成果：小红书 9,863 播放、1,564 赞，验证了核心判断：有传播力的创意组合 + 够用的制作质量，胜过大制作但缺少传播基因的炫技。' },
        tags: ['AIGC', '内容策略', 'Prompt Engineering', 'AI 视频'],
      },
      {
        group: 'video',
        title: { en: 'TourBox Elite – Product Ad', zh: 'TourBox Elite 产品广告' },
        role: { en: 'Editor + Colorist', zh: '剪辑 + 调色' },
        year: '2025',
        image: '/images/project1.png',
        images: ['/images/project1.png', '/images/project.png'],
        videoUrl: '//player.bilibili.com/player.html?bvid=BV1T87T6mESa&page=1&high_quality=1&danmaku=0',
        desc: { en: "Context: A TourBox Elite product ad working with five performers' pre-shot footage. Each performer required a customized approach — different editing rhythms and color directions to match their individual styles.\n\nEditing Strategy: Some sections breathe, some punch. The rhythm shifts match each performer's energy, while the color grade follows the same logic — warm and soft for the sunlit female segment, metallic and high-contrast for the hip-hop male segment. Working within given constraints to bring out each person's distinct feel, from raw footage to finished commercial.", zh: '项目背景：TourBox Elite 产品广告，面对五位表演者的预拍素材，为每位表演者定制差异化的剪辑节奏和调色方向。\n\n剪辑策略：有些段落快，有些段落慢下来呼吸，节奏切换匹配每位表演者的能量。调色也按同样逻辑走——阳光女性走柔和暖调，嘻哈男性突出金属质感与高对比。在给定的素材限制里，用节奏和色彩讲出每个人不同的感觉，从素材到成片独立交付。' },
        tags: ['DaVinci Resolve', '剪辑', '调色', '商业广告'],
      },
      {
        group: 'video',
        title: { en: 'Defei — Ad Campaign', zh: '德妃广告成片' },
        role: { en: 'Editor + Colorist', zh: '剪辑 + 调色' },
        year: '2025',
        image: '/images/thumb-德妃广告.jpg',
        videoFile: '/videos/德妃广告成片1.mp4',
        desc: { en: "Color Grading: Primary correction used curves and color wheels to set black and white points, sculpting light and shadow across faces and product to create a luminous, soft quality that conveys the skin-activating dynamic. The secondary grade emphasized white and violet color blocks to align with Defei's purple perilla brand palette, adding texture and a premium feel — qualifiers and window tools preserved natural skin tones throughout.\n\nEditing: Opens with the male star as a scientist in fast-cut laboratory action, building tension and anticipation. Product showcase shifts to slow motion — the perilla toner droplet suspended mid-fall, paired with sound design to amplify visual and auditory impact. The 'skin activation' motif repeats the reach-touch-illuminate gesture, the glow of a light sphere signaling the breakthrough moment the product awakens the skin's own healing power. Closes on the star's satisfied gaze at the bottle.", zh: '调色：先调光——用曲线和色轮确定黑白场，通过光影对比让人物面部更有光感、更加柔和，传达产品激活肌肤的动态过程。后调色突出白色和紫色色块，以符合德妃紫苏水乳的产品色调，同时用限定器和窗口工具保持人物肤色，增加画面质感和高级感。\n\n剪辑：以男明星饰演的科学家在实验室忙碌开场，快切手法展示严谨的实验过程，营造紧张期待的氛围。产品展示转为慢动作——紫苏水乳滴落瞬间以升格呈现，配合音效增强视觉听觉冲击力。激活肌肤以点亮光球的创意手法，重复伸手—触摸—灯亮的镜头，强调产品突破吸收障碍、激活自然愈肌之力的效果。结尾以男明星满意注视产品收束。' },
        tags: ['剪辑', '调色', '商业广告'],
      },
      {
        group: 'video',
        title: { en: "37 Interactive — Big V Sharing Vlog", zh: '三七互娱《大V分享》活动vlog' },
        role: { en: 'Editor + Colorist', zh: '剪辑 + 调色' },
        year: '2025',
        image: '/images/06大V-封面.jpg',
        images: ['/images/截屏2026-06-23 01.45.34.png', '/images/截屏2026-06-23 01.46.11.png'],
        desc: { en: "Event: A documentary-style recap for 37 Interactive Entertainment's flagship sharing event. Multiple influencers with millions of followers and industry thought leaders gathered for deep conversations around the theme 'Guangdong Life Philosophy.'\n\nEditing: Multi-camera editing weaves keynote wide shots, guest close-ups, and audience reactions into a cohesive narrative. Dynamic subtitle packaging and curated golden quotes serve as transitions and emotional peaks.\n\nVisual Design: The brand's signature purple runs throughout, reinforcing identity. Visualized subtitles turn abstract ideas into tangible moments, balancing documentary authenticity with engaging watchability.", zh: '活动背景：为三七互娱制作的大型分享活动纪实视频。活动邀请多位百万粉丝级头部博主与行业意见领袖，围绕"广东生活哲学"主题展开深度对话。\n\n剪辑手法：多机位剪辑巧妙切换演讲全景、嘉宾特写与观众反应镜头，构建完整叙事。动态字幕包装与精准抓取嘉宾金句作为转场与高潮点。\n\n视觉设计：三七互娱紫色调贯穿全片强化品牌识别度，图文结合的字幕设计将抽象观点具象化呈现，平衡纪实感与观赏性。' },
        tags: ['剪辑', '调色', '活动纪实', '多机位'],
      },
      {
        group: 'video',
        title: { en: 'Dameikang Microfilm — Meet a Better Self', zh: '达美康微电影《遇见更好的自己》' },
        role: { en: 'Editor + Colorist', zh: '剪辑 + 调色' },
        year: '2025',
        image: '/images/达美康-封面.png',
        videoUrl: '//player.bilibili.com/player.html?bvid=BV1KQ7K6CEV1&page=1&high_quality=1&danmaku=0',
        desc: { en: "Narrative: A brand microfilm for Dameikang weaving two timelines through cross-cutting — a middle-aged man encounters his younger self, their conversation threading through memories of both. The film builds toward the question 'Have I become the person you wanted me to be?', ultimately arriving at self-acceptance: the regrets and missteps of the past are what shaped him into who he is today.\n\nEditing — Flashbacks & Dissolves: Dissolves link the two characters across time — a photograph close-up blurs into a 2008 memory, expressing different emotional states while transitioning between spaces.\n\nEditing — Sound Design: Music and sound effects deepen emotional texture. 2008 Beijing Olympics broadcasts anchor the period; colleagues' and family members' voices press in during office and drunken-return scenes, rendering the protagonist's inner state through external audio.\n\nEditing — Jump Cuts: In the hospital waiting sequence, jump cuts fracture eating, drinking, and reviewing documents into separate actions. The rhythmic segmentation stretches stillness, making the weight of waiting tangible.", zh: '叙事：达美康品牌微电影，双线交叉叙事——中年自己与青年自己相遇交谈，穿插两人回忆，最终追问"我变成你想要的样子了吗"，达成自我接纳：尽管过去有遗憾和错误，但这些都是塑造今天自己的重要因素。\n\n剪辑 — 闪回与叠化：使用叠化关联两个主角，既表现人物不同的状态和情绪，也进行时空转场。当男主角拿起照片时，通过模糊效果和特写镜头过渡到2008年回忆场景。\n\n剪辑 — 声音设计：利用音乐和音效增强情感表达。回忆场景加入2008年北京奥运会背景声增加时代感；办公室和醉酒回家场景加入同事、家人的催促和对白，通过外部声音渲染主角内心情绪。\n\n剪辑 — 跳跃剪辑：医院等待场景使用跳切分割动作，将吃东西、喝水和看资料三个动作分切，以节奏化的断裂强调等待时间之久。' },
        tags: ['剪辑', '调色', '微电影', '叙事'],
      },
      {
        group: 'video',
        title: { en: 'Lingnan Impression × Big Time — Startup Competition Documentary', zh: '岭南印象园X大时空 创业比赛纪录片' },
        role: { en: 'Editor + Colorist', zh: '剪辑 + 调色' },
        year: '2025',
        image: '/images/岭南印象园-封面.jpg',
        videoUrl: '//player.bilibili.com/player.html?bvid=BV1XJ7T6WE7m&page=1&high_quality=1&danmaku=0',
        desc: { en: "Context: A youth empowerment documentary produced for Guangzhou University Town's Lingnan Impression Park — a national 4A-rated scenic area. The film chronicles the '2025 Inaugural Youth Without Limits' initiative, a cultural practice program offering young creators a platform to showcase their talent.\n\nEmotional Throughline: Anchored by 'Let me be seen for the first time', the documentary follows participants through their complete journey — from registration and creative workshops to final showcase.\n\nVisual Composition: Three distinct spaces interweave — the modern skyline of Guangzhou University Town (with Canton Tower as landmark), the heritage architecture of Lingnan's ancient ancestral halls, and the vibrant youth marketplace. Dozens of young creators captured through ensemble portraiture, with both collective ceremony and intimate craft close-ups. Shot and delivered in 4K.", zh: '项目背景：为广州大学城·岭南印象园（国家级4A景区）打造的青年赋能项目纪实短片。记录「2025首届青春无价」活动——一项面向大学生的文化实践计划，为青年创作者提供展示才华的平台。\n\n情感主线：以"让我第一次被看见"为情感主线，跟拍青年参与者从报到、创作到成果展示的完整历程，展现岭南印象园作为"青年梦想主场"的全新定位。\n\n视觉构成：三大场景交织——广州大学城天际线（现代）、霍氏大宗祠等岭南古建（传统）、青年市集（创新）。群像手法记录数十位青年创作者，既有集体合影的仪式感，也有手工艺品特写的细节刻画。4K超高清画质呈现。' },
        tags: ['剪辑', '调色', '纪实', '4K'],
      },
    ],
  },
  skills: {
    heading: { en: 'Skills', zh: '技能' },
    groups: [
      {
        label: { en: 'Video & Post-Production', zh: '视频与后期' },
        items: [
          { name: { en: 'Video Editing', zh: '视频剪辑' }, ctx: { en: '2 years · DaVinci & FCP', zh: '2年经验 · 达芬奇 & FCP' } },
          { name: { en: 'Color Toning', zh: '调色' }, ctx: { en: 'DaVinci Resolve · Film emulation', zh: '达芬奇 · 胶片模拟' } },
          { name: { en: 'AIGC Video', zh: 'AIGC 视频' }, ctx: { en: 'AI-generated content · 10K+ views', zh: 'AI 生成内容 · 播放量过万' } },
        ],
      },
      {
        label: { en: 'AI & Development', zh: 'AI 与开发' },
        items: [
          { name: { en: 'AI Agent', zh: 'AI Agent' }, ctx: { en: 'Multi-agent systems · LLM APIs', zh: '多智能体系统 · LLM API' } },
          { name: { en: 'Web Design', zh: '网页设计' }, ctx: { en: 'React · TypeScript · Tailwind', zh: 'React · TypeScript · Tailwind' } },
          { name: { en: 'Python', zh: 'Python' }, ctx: { en: 'Data analysis · Automation', zh: '数据分析 · 自动化脚本' } },
        ],
      },
    ],
  },
  contact: {
    label: { en: "Let's Talk", zh: '联系我' },
    heading: { en: 'Contact me', zh: '聊聊' },
    backToTop: { en: 'Back to Top', zh: '返回顶部' },
  },
  detail: {
    visit: { en: 'Visit Website', zh: '访问网站' },
    close: { en: 'Close Project', zh: '关闭' },
  },
};

const LangContext = createContext<Lang>('zh');

function useLang() {
  const lang = useContext(LangContext);
  return lang;
}

// Helper: resolve a t-path that may be a string or {en,zh} object
function resolve(val: any, lang: Lang): string {
  if (typeof val === 'string') return val;
  if (val && typeof val === 'object' && 'en' in val) return val[lang] ?? val.en;
  return String(val);
}

// --- Types & Interfaces ---
interface NavItem {
  id: string;
  label: { en: string; zh: string };
  num: string;
}

// --- Constants ---
const NAV_IDS = ['about', 'experience', 'projects', 'skills', 'contact'] as const;

const SCROLL_TEXT = "I'm learning to bridge video and code. I care about getting the details right, making things run well, and building something that makes someone say 'wow'.";
const REPEATED_TEXT = SCROLL_TEXT.repeat(30);

// --- Navigation ---
const Navigation: React.FC<{ lang: Lang; onToggleLang: () => void }> = ({ lang, onToggleLang }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let rafId: number;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setIsScrolled(window.scrollY > 50));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => { window.removeEventListener('scroll', handleScroll); cancelAnimationFrame(rafId); };
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) { gsap.to(window, { duration: 1.5, scrollTo: { y: el, offsetY: 70 }, ease: "power3.inOut" }); setMobileMenuOpen(false); }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-cream/80 backdrop-blur-md border-b border-mist/50 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="text-xl font-serif font-bold tracking-tighter text-dust-gray cursor-pointer" onClick={() => scrollTo('home')}>ZI YUN.</div>
        <div className="hidden md:flex items-center space-x-8">
          {NAV_IDS.map((id, i) => (
            <button key={id} onClick={() => scrollTo(id)} className="group flex items-center space-x-2 text-sm font-medium text-warm-gray hover:text-dust-gray transition-colors">
              <span className="text-xs text-tea group-hover:text-warm-gray transition-colors">0{i + 1}.</span>
              <span>{resolve((t.nav as any)[id], lang)}</span>
            </button>
          ))}
          <button onClick={onToggleLang} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-warm-gray hover:text-dust-gray hover:bg-sand transition-all">
            <Globe size={14} />
            <span className="font-mono text-xs uppercase">{lang === 'en' ? '中文' : 'EN'}</span>
          </button>
          <a href="/cv.html" target="_blank" rel="noopener noreferrer" className="px-5 py-2 border border-dust-gray rounded-full text-sm font-medium hover:bg-dust-gray hover:text-white transition-all duration-300 inline-block">
            {resolve(t.nav.resume, lang)}
          </a>
        </div>
        <div className="flex items-center gap-3 md:hidden">
          <button onClick={onToggleLang} className="text-dust-gray">
            <Globe size={18} />
          </button>
          <button className="md:hidden text-dust-gray" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileMenuOpen}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-cream border-b border-mist p-6 md:hidden flex flex-col space-y-4 shadow-xl">
          {NAV_IDS.map((id, i) => (
            <button key={id} onClick={() => scrollTo(id)} className="text-left text-lg font-serif text-dust-gray">0{i + 1}. {resolve((t.nav as any)[id], lang)}</button>
          ))}
        </div>
      )}
    </nav>
  );
};

// --- Hero ---
const Hero: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const pathTextRef = useRef<SVGTextPathElement>(null);
  const backgroundMistRef = useRef<SVGTextPathElement>(null);
  const ribbonMistRef = useRef<SVGTextPathElement>(null);
  const typewriterRef = useRef<HTMLDivElement>(null);
  const lang = useLang();

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from(".hero-content", { opacity: 0, y: 30, duration: 1.5, ease: "power3.out" });
        if (typewriterRef.current) {
          const text = resolve(t.hero.typewriter, lang);
          const tl = gsap.timeline({ delay: 3 });
          const element = typewriterRef.current;
          text.split('').forEach((_, i) => { tl.set(element, { textContent: text.substring(0, i + 1) }, i * 0.08); });
          tl.to(element, { filter: "blur(8px)", opacity: 0, duration: 0.8, delay: 2, ease: "power2.in" });
        }
        if (pathTextRef.current) { gsap.fromTo(pathTextRef.current, { attr: { startOffset: "-500%" } }, { attr: { startOffset: "0%" }, duration: 300, repeat: -1, ease: "none" }); }
        if (backgroundMistRef.current) { gsap.fromTo(backgroundMistRef.current, { attr: { startOffset: "-500%" }, opacity: 0 }, { attr: { startOffset: "0%" }, duration: 450, repeat: -1, ease: "none", opacity: 0.1, delay: 1 }); }
        if (ribbonMistRef.current) { gsap.fromTo(ribbonMistRef.current, { attr: { startOffset: "-500%" } }, { attr: { startOffset: "0%" }, duration: 300, repeat: -1, ease: "none" }); }
        gsap.to(sectionRef.current, { scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true }, y: 100, opacity: 0, scale: 0.98 });
      }, sectionRef);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, [lang]);

  return (
    <section id="home" ref={sectionRef} className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden pt-20">
      <div className="absolute top-[30%] left-0 w-full opacity-10 pointer-events-none">
        <svg viewBox="0 0 1440 300" className="w-full h-auto">
          <path id="mistPath" d="M0,100 C400,200 1000,0 1440,100" fill="transparent" />
          <text className="text-4xl font-serif fill-dust-gray tracking-tighter opacity-40"><textPath ref={backgroundMistRef} href="#mistPath">{REPEATED_TEXT}</textPath></text>
        </svg>
      </div>
      <div ref={textRef} className="hero-content relative z-10 text-center px-4 max-w-5xl mx-auto perspective-1000 -mt-12">
        <h1 className="text-5xl md:text-6xl lg:text-8xl font-serif text-dust-gray tracking-tighter mb-10">
          <div className="overflow-hidden leading-tight"><span className="inline-block">{resolve(t.hero.line1, lang)}</span></div>
          <div className="overflow-visible italic font-light text-dust-gray opacity-95 leading-none pt-1 pb-4"><span className="inline-block">{resolve(t.hero.line2, lang)}</span></div>
        </h1>

        <div ref={typewriterRef} className="mt-4 h-8 text-dust-gray/40 font-serif text-lg tracking-wide"></div>
        <div className="mt-12 opacity-0 animate-fade-in-up" style={{ animationDelay: '2s', animationFillMode: 'forwards' }}>
          <button onClick={() => gsap.to(window, { duration: 1.5, scrollTo: { y: '#projects', offsetY: 70 }, ease: 'power3.inOut' })} className="group relative px-10 py-5 bg-dust-gray text-white rounded-full overflow-hidden transition-all hover:shadow-2xl">
            <span className="relative z-10 flex items-center gap-3 text-xs uppercase tracking-widest font-medium">{resolve(t.hero.cta, lang)} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></span>
            <div className="absolute inset-0 bg-black/80 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
          </button>
        </div>
      </div>
      {/* Black Ribbon — always English */}
      <div className="absolute inset-x-0 bottom-8 h-100 pointer-events-none">
        <svg viewBox="0 0 1440 300" className="w-full h-full overflow-visible">
          <defs>
            <path id="masterCurve" d="M-100,200 C300,200 600,450 1540,150" />
            <mask id="ribbonMask"><rect x="0" y="0" width="1440" height="400" fill="black" /><rect x="720" y="0" width="1000" height="400" fill="white" /></mask>
          </defs>
          <text className="text-xl md:text-2xl font-serif fill-dust-gray opacity-10 tracking-widest uppercase"><textPath ref={ribbonMistRef} href="#masterCurve" startOffset="0%">{REPEATED_TEXT}</textPath></text>
          <g mask="url(#ribbonMask)">
            <use href="#masterCurve" fill="none" stroke="#1A1A1A" strokeWidth="60" />
            <text className="text-xl md:text-2xl font-serif fill-white tracking-widest uppercase"><textPath ref={pathTextRef} href="#masterCurve" startOffset="0%">{REPEATED_TEXT}</textPath></text>
          </g>
          <foreignObject x="670" y="275" width="100" height="40" className="overflow-visible">
            <div className="bg-white border border-dust-gray/20 rounded-full h-full w-full flex items-center justify-center space-x-1.5 shadow-xl p-2">
              {[0.1, 0.3, 0.2, 0.5, 0.2, 0.4].map((delay, i) => (<div key={i} aria-hidden="true" className="visualizer-bar w-0.5 bg-dust-gray rounded-full" style={{ animationDelay: `${delay}s`, height: '10px' }} />))}
            </div>
          </foreignObject>
        </svg>
      </div>
    </section>
  );
};

// --- About ---
const About: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lang = useLang();

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(contentRef.current, { rotateX: 20, y: 100, opacity: 0, transformOrigin: "center bottom" }, { rotateX: 0, y: 0, opacity: 1, scrollTrigger: { trigger: sectionRef.current, start: "top 80%", end: "top 30%", scrub: 1 } });
        const textElements = contentRef.current?.children;
        if (textElements) { gsap.from(textElements, { y: 40, opacity: 0, stagger: 0.2, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 70%" } }); }
      }, sectionRef);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="min-h-screen flex items-center justify-center py-24 px-6 bg-cream">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div ref={contentRef} className="space-y-8 perspective-1000">
          <div className="space-y-2">
            <div className="mb-2">
              <span className="text-sm font-mono text-warm-gray">{resolve(t.about.hi, lang)}</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold text-dust-gray tracking-tight">{resolve(t.about.name, lang)}</h2>
            {resolve(t.about.nameSub, lang) && (
              <p className="text-xl md:text-2xl font-mono text-warm-gray font-light mt-1">{resolve(t.about.nameSub, lang)}</p>
            )}
          </div>
          <p className="text-dust-gray leading-relaxed max-w-readable">{resolve(t.about.bio, lang)}</p>
          <div className="flex gap-4 pt-4">
            <button className="px-6 py-3 bg-dust-gray text-white rounded-lg hover:bg-black/80 transition-colors">{resolve(t.about.btn1, lang)}</button>
            <a href="/cv.html" target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-mist rounded-lg hover:border-dust-gray transition-colors inline-block">{resolve(t.about.btn2, lang)}</a>
          </div>
        </div>
        <div className="relative h-125 w-full bg-sand rounded-2xl overflow-hidden group shadow-2xl">
          <img src="/images/intro.png" alt="ZiYun Intro" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-dust-gray/10 group-hover:bg-transparent transition-colors duration-700" />
        </div>
      </div>
    </section>
  );
};

// --- Experience ---
const Experience: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lang = useLang();
  const experiences = t.experience.items;

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from('.exp-item', { y: 40, opacity: 0, stagger: 0.15, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } });
      }, sectionRef);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="py-32 px-6 bg-white overflow-hidden transition-colors duration-700">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-20">
          <h2 className="text-6xl md:text-8xl font-serif text-dust-gray">{resolve(t.experience.heading, lang)}</h2>
        </div>
        <div className="space-y-0 relative z-10">
          {experiences.map((exp, i) => (
            <div key={i} className="exp-item border-t border-mist py-10 group">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <span className="text-sm font-mono text-warm-gray pt-1">{resolve(exp.period, lang)}</span>
                <div className="md:col-span-2">
                  <h3 className="text-2xl font-serif text-dust-gray group-hover:tracking-wide transition-all">{resolve(exp.role, lang)}</h3>
                  <p className="text-warm-gray font-medium mt-1 mb-3">{exp.org}</p>
                  <p className="text-warm-gray leading-relaxed">{resolve(exp.desc, lang)}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="border-t border-mist" />
        </div>
      </div>

    </section>
  );
};

// --- Projects ---
const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const lang = useLang();
  const projects = t.projects.items;

  return (
    <section id="projects" ref={sectionRef} className="py-32 px-6 bg-cream relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-6xl md:text-8xl font-serif text-dust-gray">{resolve(t.projects.heading, lang)}</h2>
          <p className="max-w-readable text-lg md:text-xl text-warm-gray leading-relaxed mt-6">{resolve(t.projects.intro, lang)}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p: any, i: number) => (
            <div key={i} className="project-card group cursor-pointer glass-card rounded-2xl overflow-hidden relative" onClick={() => setSelectedProject(p)}>
              <div className="aspect-[4/3] bg-sand/50 overflow-hidden relative">
                <img src={p.image} className={`w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-in-out ${p.image === '/images/project4_1.png' ? 'object-[50%_30%]' : ''}`} alt={resolve(p.title, lang)} referrerPolicy="no-referrer" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="p-5 md:p-6">
                <span className="text-xs font-mono text-warm-gray block mb-2 uppercase tracking-widest">{resolve(p.role, lang)} — {p.year}</span>
                <h3 className="text-xl md:text-2xl font-serif text-dust-gray leading-tight mb-2">{resolve(p.title, lang)}</h3>
                <p className="text-sm text-warm-gray leading-relaxed mb-4 line-clamp-2">{resolve(p.desc, lang)}</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.tags && (p.tags as string[]).map((tag: string) => (<span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sand/70 text-warm-gray font-medium backdrop-blur-sm">{tag}</span>))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Detail Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[5000] bg-white overflow-y-auto">
            <button onClick={(e) => { e.stopPropagation(); setSelectedProject(null); }} className="absolute top-6 right-6 z-50 p-3 rounded-full bg-sand hover:bg-stone transition-colors shadow-md"><X size={20} /></button>

            <div className="max-w-[90rem] mx-auto px-4 py-12 md:py-20">
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Left — Media */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="w-full lg:w-3/5 lg:flex-shrink-0">
                  {selectedProject.videoFile ? (
                    <div className="w-full bg-black rounded-xl overflow-hidden shadow-2xl">
                      <video src={selectedProject.videoFile} className="w-full h-auto" controls playsInline />
                    </div>
                  ) : selectedProject.videoUrl ? (
                    <div className="relative w-full bg-black rounded-xl overflow-hidden shadow-2xl" style={{ paddingBottom: '56.25%' }}>
                      <iframe src={selectedProject.videoUrl} className="absolute inset-0 w-full h-full border-0" allowFullScreen sandbox="allow-same-origin allow-forms allow-scripts" />
                    </div>
                  ) : selectedProject.webUrl ? (
                    <div className="w-full bg-white rounded-xl overflow-hidden shadow-2xl border border-mist/30" style={{ height: '70vh' }}>
                      <iframe src={selectedProject.webUrl} className="w-full h-full border-0" allowFullScreen sandbox="allow-scripts allow-same-origin allow-forms allow-popups" />
                    </div>
                  ) : selectedProject.images ? (
                    <div className="grid grid-cols-1 gap-6">
                      {selectedProject.images.map((img: string, idx: number) => (
                        <motion.img key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 + 0.4 }} src={img} className="w-full h-auto rounded-xl shadow-lg" alt={`${resolve(selectedProject.title, lang)} ${idx + 1}`} referrerPolicy="no-referrer" />
                      ))}
                    </div>
                  ) : (
                    <motion.img initial={{ scale: 1.02 }} animate={{ scale: 1 }} src={selectedProject.image} className="w-full h-auto rounded-xl" alt={resolve(selectedProject.title, lang)} referrerPolicy="no-referrer" />
                  )}
                </motion.div>

                {/* Right — Text */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="w-full lg:w-2/5 lg:overflow-y-auto lg:max-h-[75vh]">
                  <div className="flex space-x-4 text-xs font-mono text-warm-gray mb-6 tracking-tighter uppercase"><span>{resolve(selectedProject.role, lang)}</span><span>•</span><span>{selectedProject.year}</span></div>
                  <h3 className="text-4xl md:text-5xl font-serif text-dust-gray mb-6 leading-[1.05]">{resolve(selectedProject.title, lang)}</h3>
                  <div className="text-base text-warm-gray leading-relaxed mb-6 space-y-5">
                    {resolve(selectedProject.desc, lang).split('\n\n').map((block: string, bi: number) => {
                      const headerMatch = block.match(/^([^：:\n]+)[：:]\s*/);
                      if (headerMatch) {
                        const header = headerMatch[1];
                        const body = block.slice(headerMatch[0].length);
                        return (
                          <div key={bi}>
                            <h4 className="text-sm font-semibold text-dust-gray tracking-wide mb-1.5">{header}</h4>
                            <p className="text-warm-gray leading-relaxed">{body}</p>
                          </div>
                        );
                      }
                      return <p key={bi} className="text-warm-gray leading-relaxed">{block}</p>;
                    })}
                  </div>
                  {selectedProject.tags && (<div className="flex flex-wrap gap-2 mb-8">{(selectedProject.tags as string[]).map((tag: string) => (<span key={tag} className="text-xs font-mono px-3 py-1.5 rounded-full bg-sand text-warm-gray font-medium">{tag}</span>))}</div>)}
                  {selectedProject.webUrl && (
                    <a href={selectedProject.webUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center space-x-3 text-dust-gray font-medium hover:underline transition-all group/link">
                      <span className="font-mono text-sm tracking-widest uppercase group-hover/link:translate-x-1 transition-transform">{resolve(t.detail.visit, lang)}</span><ArrowRight className="group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  )}
                  <div className="mt-8">
                    <button onClick={() => setSelectedProject(null)} className="flex items-center space-x-3 text-warm-gray hover:text-dust-gray transition-colors">
                      <ArrowRight className="rotate-180" size={16} /><span className="font-mono text-sm tracking-widest uppercase">{resolve(t.detail.close, lang)}</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

// --- Skills ---
const Skills: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lang = useLang();

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(".skill-group", { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.2, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 75%" } });
        gsap.fromTo(".skill-card", { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 70%" } });
      }, sectionRef);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="py-32 px-6 bg-cream">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-20">
          <h2 className="text-6xl md:text-8xl font-serif text-dust-gray">{resolve(t.skills.heading, lang)}</h2>
        </div>
        <div className="space-y-20">
          {t.skills.groups.map((group, gi) => (
            <div key={gi} className="skill-group">
              <h3 className="text-sm font-mono text-warm-gray uppercase tracking-widest mb-8">{resolve(group.label, lang)}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {group.items.map((item, ii) => (
                  <div key={ii} className="skill-card group p-6 bg-white border border-mist/50 hover:border-dust-gray/20 hover:shadow-lg transition-all duration-500">
                    <h4 className="text-xl font-serif text-dust-gray mb-2">{resolve(item.name, lang)}</h4>
                    <p className="text-sm text-warm-gray leading-relaxed">{resolve(item.ctx, lang)}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Contact ---
const Contact: React.FC = () => {
  const lang = useLang();

  return (
    <section id="contact" className="min-h-screen flex flex-col justify-center items-center bg-[#e8e0d3] text-dust-gray px-6 py-24 relative">
      <div className="relative z-10 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-10 md:p-16 max-w-2xl w-full text-center">
        <h2 className="text-sm font-mono text-warm-gray mb-6 tracking-widest uppercase">{resolve(t.contact.label, lang)}</h2>
        <p className="text-4xl md:text-5xl font-serif mb-10 leading-tight">{resolve(t.contact.heading, lang)}</p>
        <a href="mailto:25417681@life.hkbu.edu.hk" className="inline-block text-xl md:text-2xl text-dust-gray border-b border-dust-gray/30 pb-1.5 hover:text-warm-gray hover:border-warm-gray transition-all">25417681@life.hkbu.edu.hk</a>
        <div className="mt-8 space-y-2 text-sm font-mono text-warm-gray">
          <p>{resolve(t.about.phone, lang)}</p>
          <p><a href="https://github.com/purplecloud0342-source" target="_blank" rel="noopener noreferrer" className="hover:text-dust-gray transition-colors">{resolve(t.about.github, lang)}</a></p>
        </div>
        <button onClick={() => gsap.to(window, { duration: 1.5, scrollTo: { y: 0 }, ease: 'power3.inOut' })} className="mt-8 text-xs font-mono text-warm-gray hover:text-dust-gray transition-colors">{resolve(t.contact.backToTop, lang)}</button>
      </div>
      <footer className="mt-8 text-xs text-dust-gray/30 font-mono">
        <span>© 2026 ZIYUN DEV</span>
      </footer>
    </section>
  );
};

// --- Main App ---
const App: React.FC = () => {
  const [lang, setLang] = useState<Lang>('zh');

  useEffect(() => {
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
  }, [lang]);

  return (
    <LangContext.Provider value={lang}>
      <div className="bg-cream text-dust-gray selection:bg-dust-gray selection:text-white">
        <style>{`
          .perspective-1000 { perspective: 1000px; }
          @keyframes visualizer { 0%, 100% { height: 4px; } 50% { height: 20px; } }
          .visualizer-bar { animation: visualizer 1.2s ease-in-out infinite; }
          @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade-in-up { animation: fade-in-up 1s ease-out forwards; }
          @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          .animate-spin-slow { animation: spin-slow 20s linear infinite; }
          @media (prefers-reduced-motion: reduce) {
            .visualizer-bar { animation: none; }
            .animate-fade-in-up { animation: none; opacity: 1; transform: none; }
            .animate-spin-slow { animation: none; }
          }
        `}</style>
        <Navigation lang={lang} onToggleLang={() => setLang(l => l === 'en' ? 'zh' : 'en')} />
        <main>
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Skills />
          <Contact />
        </main>
      </div>
    </LangContext.Provider>
  );
};

export default App;
