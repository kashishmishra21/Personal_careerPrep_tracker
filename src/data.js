// Plan data. Syllabus topics are copied verbatim from "Must Read Topics for Interviews" PDF.
export const START = Date.UTC(2026, 9, 3) // 3 Oct 2026 (Saturday)
export const DAYS = 60 // matches the 2-month DSA series
export const key = d => new Date(START + d * 864e5).toISOString().slice(0, 10)
export const dowOf = d => new Date(START + d * 864e5).getUTCDay() // 0=Sun
export const fmt = (d, o = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) =>
  new Date(START + d * 864e5).toLocaleDateString('en-GB', { ...o, timeZone: 'UTC' })
// day index of a local Date relative to start (negative = before start)
export const idxOf = dt => Math.round((Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate()) - START) / 864e5)

export const CATS = {
  DSA: '#2f81f7', Interview: '#a371f7', 'HR Interview': '#db61a2', 'MERN Interview': '#3fb950',
  Project: '#d29922', Certificate: '#1f9d8f', Hackathon: '#f0883e', 'Job Application': '#e5534b', 'Career Activity': '#768390',
}
export const ST = ['Not Started', 'Learning', 'Revised', 'Ready']
export const HR = ['Tell me about yourself', 'Strengths', 'Weaknesses', 'Career goals', 'Why should we hire you?', 'Why this role?', 'Projects', 'Challenges', 'Teamwork', 'Career transition', 'Salary expectations', 'Questions for interviewer']
export const MERN = ['JavaScript', 'React', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Authentication/JWT', 'Git/GitHub', 'Deployment', 'Frontend concepts', 'Backend concepts']

const S = (name, items, t = null) => ({ name, groups: [{ t, items }] })
export const SYLLABUS = [
  S('OOPS', ['Four Pillars (Encapsulation, Abstraction, Inheritance, Polymorphism)', 'Runtime vs Compile Time Polymorphism', 'Method Overloading vs Overriding', 'Interface vs Abstract Class', 'Association, Aggregation, Composition', 'SOLID Principles', 'Constructor Chaining', 'Object Cloning (Deep vs Shallow Copy)', 'Static vs Instance Members', 'Access Modifiers', 'Diamond Problem', 'Dependency Injection', 'Cohesion vs Coupling', 'Immutable Objects', 'Design Patterns (Singleton, Factory, Strategy)']),
  S('DBMS', ['ACID Properties', 'Normalization (1NF-BCNF)', 'Denormalization', 'Primary vs Foreign Key', 'Indexing', 'Clustered vs Non-Clustered Index', 'B+ Trees', 'Joins (All Types)', 'Transactions', 'Locks (Shared/Exclusive)', 'Deadlock', 'Isolation Levels', 'CAP Theorem', 'Sharding', 'SQL vs NoSQL']),
  S('Computer Networks', ['TCP vs UDP', 'OSI Model', 'TCP/IP Model', 'Three-Way Handshake', 'Four-Way Connection Termination', 'HTTP vs HTTPS', 'DNS Working', 'Load Balancer', 'Reverse Proxy', 'SSL/TLS', 'Cookies vs Sessions', 'REST APIs', 'WebSocket', 'CDN', 'How Browser Opens Google.com']),
  S('Operating System', ['Process vs Thread', 'Context Switching', 'Multithreading', 'Scheduling Algorithms', 'Deadlock', 'Starvation', 'Race Condition', 'Mutex', 'Semaphore', 'Paging', 'Segmentation', 'Virtual Memory', 'Heap vs Stack', 'Memory Allocation', 'Garbage Collection']),
  S('Puzzles', ['25 Horses Puzzle', '8 Ball Puzzle', 'Bridge and Torch', 'Water Jug', '100 Prisoners', 'Egg Dropping', 'Coin Flip', 'Poisoned Bottle', 'Pirate Gold Division', 'Clock Angle', 'Train Crossing', 'River Crossing', 'Probability Dice Questions', 'Monty Hall Problem', 'Logical Deduction Puzzles']),
  S('Linux', ['What happens when you type a command in terminal?', 'Difference between Process and Thread?', 'What is a Zombie Process?', 'What is a Daemon Process?', 'Difference between Hard Link and Soft Link?', 'What is an Inode in Linux?', 'Explain chmod 755.', 'Difference between kill and kill -9.', 'Difference between grep, find, and locate.', 'Difference between > and >>.', 'What is Pipe | in Linux?', 'What is Swap Memory?', 'What happens when RAM gets full?', 'Difference between TCP and UDP?', 'Difference between HTTP and HTTPS?', 'What is SSH?', 'What is Cron Job?', 'What is Environment Variable and PATH?', 'Explain fork() and exec().', 'Your production server is down — how will you debug?']),
  S('Git', ['What is Git?', 'Difference between Git and GitHub?', 'What is a Repository?', 'Difference between git pull and git fetch?', 'Difference between git merge and git rebase?', 'What is a Branch in Git?', 'Why do we use Pull Requests?', 'What is Git Stash?', 'Difference between git reset and git revert?', 'What is Merge Conflict?', 'How do you resolve merge conflicts?', 'Difference between Local Repository and Remote Repository?', 'What is .gitignore?', 'Difference between git clone and git fork?', 'What is HEAD in Git?', 'Difference between git add . and git add <file>?', 'What is Detached HEAD state?', 'Explain Git workflow in teams.', 'How do you undo a commit?', 'How do you debug when code works locally but fails after merge?']),
  S('SQL', ['Find nth highest salary using SQL', 'Find the 2nd highest salary from Employee table', 'Find duplicate records in a table', 'Delete duplicate rows from a table', 'Find highest salary department-wise', 'Find employees earning more than department average', 'Find employees with same salary', 'Find manager name along with employee name using self join', 'Find departments having more than 5 employees', 'Find customers who never placed orders', 'Difference between DELETE, DROP, and TRUNCATE', 'Difference between WHERE and HAVING', 'Difference between INNER JOIN and LEFT JOIN', 'What is normalization and its types?', 'Difference between PRIMARY KEY and FOREIGN KEY', 'What is indexing and why is it used?', 'Difference between UNION and UNION ALL', 'What are ACID properties in SQL?', 'Difference between clustered and non-clustered index', 'What is subquery vs correlated subquery?']),
  { name: 'Language Core (Java/C++/Python)', groups: [
    { t: 'C++', items: ['Stack vs Heap memory', 'Difference between compile time and runtime polymorphism', 'What happens during compilation in C++?', 'What is virtual function and how vtable works?', 'Difference between shallow copy and deep copy', 'Copy constructor vs move constructor', 'What are smart pointers and why needed?', 'Difference between process and thread', 'What causes memory leak and segmentation fault?', 'Difference between malloc/free and new/delete'] },
    { t: 'Java', items: ['Difference between JDK, JRE, JVM', 'How Java achieves platform independence?', 'Heap vs Stack memory in JVM', 'How Garbage Collection works in Java?', 'Difference between == and equals()', 'Difference between HashMap and ConcurrentHashMap', 'Process vs Thread in Java', 'What is synchronization and deadlock?', 'What happens when a Java program runs internally?', 'Difference between String, StringBuilder, and StringBuffer'] },
    { t: 'Python', items: ['What is GIL (Global Interpreter Lock)?', 'Difference between multithreading and multiprocessing', 'Mutable vs Immutable objects', 'Difference between is and ==', 'Deep copy vs shallow copy', 'How Python memory management works?', 'What happens when Python code executes internally?', 'List vs Tuple', 'What are generators and why are they memory efficient?', 'Difference between interpreter and compiler in Python'] }] },
  S('Projects / Behavioral', ['Explain Your Project Architecture', 'Biggest Technical Challenge', 'Why This Tech Stack?', 'Scalability Improvements', 'Database Design Decisions', 'Security Implementations', 'Performance Optimizations', 'CI/CD Pipeline', 'Monitoring & Logging', 'Caching Strategy', 'Failure Handling', 'Team Conflict Situation', 'Leadership Example', 'Production Bug You Solved', 'Why Should We Hire You?']),
]

export const TOPICS = [] // every PDF topic: {id, sec, group, n, text}
export const CHUNKS = [] // study sessions of <=5 consecutive topics, in PDF order
SYLLABUS.forEach((s, si) => s.groups.forEach((g, gi) => {
  g.items.forEach((text, i) => TOPICS.push({ id: `i${si}-${gi}-${i}`, sec: s.name, group: g.t, n: i + 1, text }))
  for (let a = 0; a < g.items.length; a += 5)
    CHUNKS.push(`${s.name}${g.t ? ` (${g.t})` : ''} · topics ${a + 1}–${Math.min(a + 5, g.items.length)}`)
}))

// PLAN[d] = tasks for day d (0 = 3 Oct 2026). Weekdays: interview-heavy. Weekends: project-focused.
export const PLAN = []
let wd = 0, hr = 0, mn = 0
for (let d = 0; d < DAYS; d++) {
  const w = dowOf(d), t = []
  const add = (id, cat, text, min) => t.push({ id: id + d, cat, text, min })
  add('dsa', 'DSA', `Watch DSA video #${d + 1} and solve 2–3 problems`, 90)
  if (w >= 1 && w <= 5) {
    add('int', 'Interview', wd < CHUNKS.length ? `Study ${CHUNKS[wd]}` : `Revise ${SYLLABUS[(wd - CHUNKS.length) % SYLLABUS.length].name}`, 45)
    wd++
  }
  if (w === 2 || w === 4) add('hr', 'HR Interview', `Practise: ${HR[hr++ % HR.length]}`, 30)
  if (w === 1 || w === 3 || w === 5) add('mern', 'MERN Interview', `MERN: ${MERN[mn++ % MERN.length]} questions`, 40)
  if (w === 3) add('cert', 'Certificate', 'Certificate course progress', 45)
  if (w === 5) add('job', 'Job Application', 'Apply to 2–3 jobs', 45)
  if (w === 6) add('proj', 'Project', 'Project build session', 120)
  if (w === 0) add('proj', 'Project', 'Project session: finish features / deploy', 120)
  if (w === 6) add('hack', 'Hackathon', 'Check hackathons / work on idea', 30)
  if (w === 0) add('job', 'Job Application', 'Weekly job search: save and apply', 45)
  const career = { 2: 'LinkedIn networking', 4: 'LinkedIn post', 5: 'GitHub activity', 6: 'Project commit', 0: 'Resume/portfolio update' }[w]
  if (career) add('car', 'Career Activity', career, 20)
  PLAN.push(t)
}
