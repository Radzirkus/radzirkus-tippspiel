import React from 'react';

// These are mutable - can be replaced by Supabase data
export let T = [
  { id:"apt", n:"Alpecin – Premier Tech", s:"APT", bg:"#4dc9e6", fg:"#0a1a3a" },
  { id:"bah", n:"Bahrain Victorious", s:"BAH", bg:"#1a2744", fg:"#00c8d4" },
  { id:"bar", n:"Bardiani CSF 7 Saber", s:"BAR", bg:"#18b0a0", fg:"#0e2a28" },
  { id:"dec", n:"Decathlon CMA CGM", s:"DEC", bg:"#e8edf2", fg:"#0055a0" },
  { id:"efe", n:"EF Education – EasyPost", s:"EFE", bg:"#ed408a", fg:"#fff" },
  { id:"gfc", n:"Groupama – FDJ United", s:"GFC", bg:"#0055a0", fg:"#fff" },
  { id:"ine", n:"Netcompany INEOS", s:"INE", bg:"#4a5a4a", fg:"#e07020" },
  { id:"ltk", n:"Lidl – Trek", s:"LTK", bg:"#e3001b", fg:"#fff" },
  { id:"lot", n:"Lotto – Intermarché", s:"LOT", bg:"#c8102e", fg:"#fff" },
  { id:"mov", n:"Movistar Team", s:"MOV", bg:"#003d7a", fg:"#00b5e2" },
  { id:"nsn", n:"NSN Cycling Team", s:"NSN", bg:"#1a1a3a", fg:"#e040a0" },
  { id:"q36", n:"Pinarello Q36.5", s:"Q36", bg:"#1a2744", fg:"#c9a44a" },
  { id:"rbh", n:"Red Bull – BORA – hansgrohe", s:"RBH", bg:"#1a3a5c", fg:"#fff" },
  { id:"sqs", n:"Soudal Quick-Step", s:"SQS", bg:"#1e3a6e", fg:"#fff" },
  { id:"jay", n:"Team Jayco AlUla", s:"JAY", bg:"#4a2a6e", fg:"#7ccc60" },
  { id:"pic", n:"Team Picnic PostNL", s:"PIC", bg:"#1a2744", fg:"#ff8c00" },
  { id:"pol", n:"Polti VisitMalta", s:"POL", bg:"#eeeef0", fg:"#c8102e" },
  { id:"vis", n:"Visma | Lease a Bike", s:"VIS", bg:"#ffd700", fg:"#000" },
  { id:"tud", n:"Tudor Pro Cycling", s:"TUD", bg:"#1c1c1c", fg:"#c9a44a" },
  { id:"uae", n:"UAE Emirates – XRG", s:"UAE", bg:"#f2f2f2", fg:"#1a1a1a" },
  { id:"uni", n:"Unibet Rose Rockets", s:"UNI", bg:"#e066a0", fg:"#2040a0" },
  { id:"uno", n:"Uno-X Mobility", s:"UNO", bg:"#8b1a2b", fg:"#ffd700" },
  { id:"ast", n:"XDS Astana Team", s:"AST", bg:"#00afcb", fg:"#fff" },
];

export let R = [
  // Alpecin – Premier Tech
  {i:"apt1",n:"Kaden Groves",t:"apt"},{i:"apt2",n:"Tobias Bayer",t:"apt"},{i:"apt3",n:"Francesco Busatto",t:"apt"},{i:"apt4",n:"Jonas Geens",t:"apt"},{i:"apt5",n:"Edward Planckaert",t:"apt"},{i:"apt6",n:"Jensen Plowright",t:"apt"},{i:"apt7",n:"Johan Price-Pejtersen",t:"apt"},{i:"apt8",n:"Luca Vergallito",t:"apt"},
  // Bahrain Victorious
  {i:"bah1",n:"Santiago Buitrago",t:"bah"},{i:"bah2",n:"Damiano Caruso",t:"bah"},{i:"bah3",n:"Matevž Govekar",t:"bah"},{i:"bah4",n:"Fran Miholjević",t:"bah"},{i:"bah5",n:"Afonso Eulálio",t:"bah"},{i:"bah6",n:"Mathijs Paasschens",t:"bah"},{i:"bah7",n:"Alec Segaert",t:"bah"},{i:"bah8",n:"Edoardo Zambanini",t:"bah"},
  // Bardiani CSF
  {i:"bar1",n:"Manuele Tarozzi",t:"bar"},{i:"bar2",n:"Filippo Turconi",t:"bar"},{i:"bar3",n:"Luca Covili",t:"bar"},{i:"bar4",n:"Filippo Magli",t:"bar"},{i:"bar5",n:"Martin Marcellusi",t:"bar"},{i:"bar6",n:"Alessio Martinelli",t:"bar"},{i:"bar7",n:"Luca Paletti",t:"bar"},{i:"bar8",n:"Enrico Zanoncello",t:"bar"},
  // Decathlon CMA CGM
  {i:"dec1",n:"Felix Gall",t:"dec"},{i:"dec2",n:"Tobias Lund Andresen",t:"dec"},{i:"dec3",n:"Tord Gudmestad",t:"dec"},{i:"dec4",n:"Gregor Mühlberger",t:"dec"},{i:"dec5",n:"Oliver Naesen",t:"dec"},{i:"dec6",n:"Rasmus Søjberg Pedersen",t:"dec"},{i:"dec7",n:"Callum Scotson",t:"dec"},{i:"dec8",n:"Johannes Staune-Mittet",t:"dec"},
  // EF Education
  {i:"efe1",n:"Samuele Battistella",t:"efe"},{i:"efe2",n:"Jefferson A. Cepeda",t:"efe"},{i:"efe3",n:"Sean Quinn",t:"efe"},{i:"efe4",n:"Darren Rafferty",t:"efe"},{i:"efe5",n:"James Shaw",t:"efe"},{i:"efe6",n:"Michael Valgren",t:"efe"},{i:"efe7",n:"Jardi van der Lee",t:"efe"},
  // Groupama FDJ
  {i:"gfc1",n:"Lorenzo Germani",t:"gfc"},{i:"gfc2",n:"Rémi Cavagna",t:"gfc"},{i:"gfc3",n:"Cyril Barthe",t:"gfc"},{i:"gfc4",n:"Axel Huens",t:"gfc"},{i:"gfc5",n:"Johan Jacobs",t:"gfc"},{i:"gfc6",n:"Josh Kench",t:"gfc"},{i:"gfc7",n:"Paul Penhoët",t:"gfc"},{i:"gfc8",n:"Rémy Rochas",t:"gfc"},{i:"gfc9",n:"Brieuc Rolland",t:"gfc"},
  // INEOS
  {i:"ine1",n:"Egan Bernal",t:"ine"},{i:"ine2",n:"Thymen Arensman",t:"ine"},{i:"ine3",n:"Filippo Ganna",t:"ine"},{i:"ine4",n:"Jack Haig",t:"ine"},{i:"ine5",n:"Magnus Sheffield",t:"ine"},{i:"ine6",n:"Embret Svestad-Bårdseng",t:"ine"},{i:"ine7",n:"Connor Swift",t:"ine"},{i:"ine8",n:"Ben Turner",t:"ine"},
  // Lidl Trek
  {i:"ltk1",n:"Giulio Ciccone",t:"ltk"},{i:"ltk2",n:"Simone Consonni",t:"ltk"},{i:"ltk3",n:"Derek Gee-West",t:"ltk"},{i:"ltk4",n:"Amanuel Ghebreigzabhier",t:"ltk"},{i:"ltk5",n:"Jonathan Milan",t:"ltk"},{i:"ltk6",n:"Matteo Sobrero",t:"ltk"},{i:"ltk7",n:"Tim Torn Teutenberg",t:"ltk"},{i:"ltk8",n:"Max Walscheid",t:"ltk"},
  // Lotto Intermarché
  {i:"lot1",n:"Lennert Van Eetvelt",t:"lot"},{i:"lot2",n:"Liam Slock",t:"lot"},{i:"lot3",n:"Arnaud De Lie",t:"lot"},{i:"lot4",n:"Toon Aerts",t:"lot"},{i:"lot5",n:"Jasper De Buyst",t:"lot"},{i:"lot6",n:"Simone Gualdi",t:"lot"},{i:"lot7",n:"Mathieu Kockelmann",t:"lot"},{i:"lot8",n:"Milan Menten",t:"lot"},{i:"lot9",n:"Lorenzo Rota",t:"lot"},{i:"lot10",n:"Jonas Rutsch",t:"lot"},
  // Movistar
  {i:"mov1",n:"Iván García Cortina",t:"mov"},{i:"mov2",n:"Orluis Aular",t:"mov"},{i:"mov3",n:"Juan Pedro López",t:"mov"},{i:"mov4",n:"Enric Mas",t:"mov"},{i:"mov5",n:"Lorenzo Milesi",t:"mov"},{i:"mov6",n:"Nelson Oliveira",t:"mov"},{i:"mov7",n:"Javier Romo",t:"mov"},{i:"mov8",n:"Einer Rubio",t:"mov"},
  // NSN Cycling
  {i:"nsn1",n:"Alessandro Pinarello",t:"nsn"},{i:"nsn2",n:"Jan Hirt",t:"nsn"},{i:"nsn3",n:"Ryan Mullen",t:"nsn"},{i:"nsn4",n:"Nick Schultz",t:"nsn"},{i:"nsn5",n:"Dion Smith",t:"nsn"},{i:"nsn6",n:"Jake Stewart",t:"nsn"},{i:"nsn7",n:"Corbin Strong",t:"nsn"},{i:"nsn8",n:"Ethan Vernon",t:"nsn"},
  // Q36.5
  {i:"q361",n:"Sjoerd Bax",t:"q36"},{i:"q362",n:"Fabio Christen",t:"q36"},{i:"q363",n:"David de la Cruz",t:"q36"},{i:"q364",n:"Mark Donovan",t:"q36"},{i:"q365",n:"David González",t:"q36"},{i:"q366",n:"Chris Harper",t:"q36"},{i:"q367",n:"Matteo Moschetti",t:"q36"},{i:"q368",n:"Nickolas Zukowsky",t:"q36"},
  // Red Bull BORA
  {i:"rbh1",n:"Giulio Pellizzari",t:"rbh"},{i:"rbh2",n:"Jai Hindley",t:"rbh"},{i:"rbh3",n:"Aleksandr Vlasov",t:"rbh"},{i:"rbh4",n:"Danny van Poppel",t:"rbh"},{i:"rbh5",n:"Gianni Moscon",t:"rbh"},{i:"rbh6",n:"Mick van Dijke",t:"rbh"},{i:"rbh7",n:"Ben Zwiehoff",t:"rbh"},{i:"rbh8",n:"Giovanni Aleotti",t:"rbh"},{i:"rbh9",n:"Luke Tuckwell",t:"rbh"},
  // Soudal QS
  {i:"sqs1",n:"Jasper Stuyven",t:"sqs"},{i:"sqs2",n:"Paul Magnier",t:"sqs"},{i:"sqs3",n:"Filippo Zana",t:"sqs"},{i:"sqs4",n:"Ayco Bastiaens",t:"sqs"},{i:"sqs5",n:"Gianmarco Garofoli",t:"sqs"},{i:"sqs6",n:"Andrea Raccagni Noviero",t:"sqs"},{i:"sqs7",n:"Dries Van Gestel",t:"sqs"},
  // Jayco AlUla
  {i:"jay1",n:"Ben O'Connor",t:"jay"},{i:"jay2",n:"Pascal Ackermann",t:"jay"},{i:"jay3",n:"Koen Bouwman",t:"jay"},{i:"jay4",n:"Robert Donaldson",t:"jay"},{i:"jay5",n:"Felix Engelhardt",t:"jay"},{i:"jay6",n:"Alan Hatherly",t:"jay"},{i:"jay7",n:"Christopher Juul-Jensen",t:"jay"},{i:"jay8",n:"Andrea Vendrame",t:"jay"},{i:"jay9",n:"Filippo Conca",t:"jay"},{i:"jay0",n:"Luka Mezgec",t:"jay"},
  // Picnic PostNL
  {i:"pic1",n:"Frank van den Broek",t:"pic"},{i:"pic2",n:"Casper van Uden",t:"pic"},{i:"pic3",n:"James Knox",t:"pic"},{i:"pic4",n:"Timo de Jong",t:"pic"},{i:"pic5",n:"Sean Flynn",t:"pic"},{i:"pic6",n:"Chris Hamilton",t:"pic"},{i:"pic7",n:"Gijs Leemreize",t:"pic"},{i:"pic8",n:"Tim Naberman",t:"pic"},
  // Polti VisitMalta
  {i:"pol1",n:"Mirco Maestri",t:"pol"},{i:"pol2",n:"Mattia Bais",t:"pol"},{i:"pol3",n:"Ludovico Crescioli",t:"pol"},{i:"pol4",n:"Giovanni Lonardi",t:"pol"},{i:"pol5",n:"Andrea Mifsud",t:"pol"},{i:"pol6",n:"Thomas Pesenti",t:"pol"},{i:"pol7",n:"Andrea Pietrobon",t:"pol"},{i:"pol8",n:"Diego Pablo Sevilla",t:"pol"},
  // Visma
  {i:"vis1",n:"Jonas Vingegaard",t:"vis"},{i:"vis2",n:"Victor Campenaerts",t:"vis"},{i:"vis3",n:"Sepp Kuss",t:"vis"},{i:"vis4",n:"Wilco Kelderman",t:"vis"},{i:"vis5",n:"Bart Lemmen",t:"vis"},{i:"vis6",n:"Tim Rex",t:"vis"},{i:"vis7",n:"Timo Kielich",t:"vis"},{i:"vis8",n:"Edoardo Affini",t:"vis"},
  // Tudor
  {i:"tud1",n:"Michael Storer",t:"tud"},{i:"tud2",n:"Mathys Rondel",t:"tud"},{i:"tud3",n:"Will Barta",t:"tud"},{i:"tud4",n:"Robin Froidevaux",t:"tud"},{i:"tud5",n:"Luca Mozzato",t:"tud"},{i:"tud6",n:"Florian Stork",t:"tud"},{i:"tud7",n:"Larry Warbasse",t:"tud"},
  // UAE
  {i:"uae1",n:"Jay Vine",t:"uae"},{i:"uae2",n:"Adam Yates",t:"uae"},{i:"uae3",n:"Marc Soler",t:"uae"},{i:"uae4",n:"Jan Christen",t:"uae"},{i:"uae5",n:"António Morgado",t:"uae"},{i:"uae6",n:"Igor Arrieta",t:"uae"},{i:"uae7",n:"Jhonatan Narváez",t:"uae"},
  // Unibet Rose Rockets
  {i:"uni1",n:"Dylan Groenewegen",t:"uni"},{i:"uni2",n:"Hartthijs de Vries",t:"uni"},{i:"uni3",n:"Karsten Larsen Feldmann",t:"uni"},{i:"uni4",n:"Tomáš Kopecký",t:"uni"},{i:"uni5",n:"Lukáš Kubiš",t:"uni"},{i:"uni6",n:"Niklas Larsen",t:"uni"},{i:"uni7",n:"Wout Poels",t:"uni"},{i:"uni8",n:"Elmar Reinders",t:"uni"},
  // Uno-X
  {i:"uno1",n:"Andreas Leknessund",t:"uno"},{i:"uno2",n:"Markus Hoelgaard",t:"uno"},{i:"uno3",n:"Ådne Holter",t:"uno"},{i:"uno4",n:"Johannes Kulset",t:"uno"},{i:"uno5",n:"Fredrik Dversnes Lavik",t:"uno"},{i:"uno6",n:"Erlend Blikra",t:"uno"},{i:"uno7",n:"Sakarias Koller Løland",t:"uno"},{i:"uno8",n:"Martin Tjøtta",t:"uno"},
  // Astana
  {i:"ast1",n:"Alberto Bettiol",t:"ast"},{i:"ast2",n:"Diego Ulissi",t:"ast"},{i:"ast3",n:"Lorenzo Fortunato",t:"ast"},{i:"ast4",n:"Davide Ballerini",t:"ast"},{i:"ast5",n:"Christian Scaroni",t:"ast"},{i:"ast6",n:"Harold Martín López",t:"ast"},{i:"ast7",n:"Arjen Livyns",t:"ast"},{i:"ast8",n:"Matteo Malucelli",t:"ast"},{i:"ast9",n:"Guillermo Thomas Silva",t:"ast"},
];

export let ST = [
  {id:1,d:"2026-05-08",tm:"12:30",t:"Nessebar → Burgas",y:"flach",km:156},
  {id:2,d:"2026-05-09",tm:"11:30",t:"Burgas → Veliko Tarnovo",y:"mittel",km:220},
  {id:3,d:"2026-05-10",tm:"12:00",t:"Plovdiv → Sofia",y:"flach",km:174},
  {id:4,d:"2026-05-12",tm:"12:15",t:"Catanzaro → Cosenza",y:"mittel",km:144},
  {id:5,d:"2026-05-13",tm:"11:45",t:"Praia a Mare → Potenza",y:"mittel",km:204},
  {id:6,d:"2026-05-14",tm:"12:30",t:"Paestum → Napoli",y:"flach",km:161},
  {id:7,d:"2026-05-15",tm:"10:30",t:"Formia → Blockhaus",y:"berg",km:246},
  {id:8,d:"2026-05-16",tm:"12:00",t:"Chieti → Fermo",y:"mittel",km:159},
  {id:9,d:"2026-05-17",tm:"11:30",t:"Cervia → Corno alle Scale",y:"berg",km:184},
  {id:10,d:"2026-05-19",tm:"13:00",t:"Viareggio → Massa (EZF)",y:"zeitfahren",km:40},
  {id:11,d:"2026-05-20",tm:"12:00",t:"Porcari → Chiavari",y:"mittel",km:178},
  {id:12,d:"2026-05-21",tm:"12:15",t:"Imperia → Novi Ligure",y:"mittel",km:177},
  {id:13,d:"2026-05-22",tm:"11:45",t:"Alessandria → Verbania",y:"mittel",km:186},
  {id:14,d:"2026-05-23",tm:"12:00",t:"Aosta → Pila",y:"berg",km:133},
  {id:15,d:"2026-05-24",tm:"12:30",t:"Voghera → Milano",y:"flach",km:136},
  {id:16,d:"2026-05-26",tm:"12:00",t:"Bellinzona → Carì",y:"berg",km:113},
  {id:17,d:"2026-05-27",tm:"11:00",t:"Cassano d'Adda → Andalo",y:"berg",km:200},
  {id:18,d:"2026-05-28",tm:"12:00",t:"Fai della Paganella → Pieve di Soligo",y:"mittel",km:167},
  {id:19,d:"2026-05-29",tm:"11:00",t:"Feltre → Alleghe",y:"berg",km:151},
  {id:20,d:"2026-05-30",tm:"10:30",t:"Gemona del Friuli → Piancavallo",y:"berg",km:200},
  {id:21,d:"2026-05-31",tm:"13:30",t:"Roma → Roma",y:"flach",km:131},
];

export const JER = [
  {id:"rosa",n:"Maglia Rosa",ds:"Gesamtwertung",em:"🩷",cl:"#f472b6"},
  {id:"cicl",n:"Maglia Ciclamino",ds:"Punktewertung",em:"🟣",cl:"#a855f7"},
  {id:"azz",n:"Maglia Azzurra",ds:"Bergwertung",em:"🔵",cl:"#3b82f6"},
  {id:"bia",n:"Maglia Bianca",ds:"Bester Jungprofi",em:"⚪",cl:"#e2e8f0"},
];

export const PTS={e1:10,e2:7,e3:5,wp:3,rt:1,je:25,jt:10};
export const DU=[{n:"VeloVince",s:47},{n:"PedalPetra",s:42},{n:"KetteRechts",s:38},{n:"BergKönig_89",s:35},{n:"Gruppetto_Franz",s:31},{n:"Flamme_Rouge",s:28},{n:"RadKarl",s:24},{n:"DossimoFan",s:19}];

export const gT=id=>T.find(x=>x.id===id);
export const gR=id=>R.find(x=>x.i===id);
export const gRT=id=>{const r=gR(id);return r?gT(r.t):null;};
export const tE=y=>y==="berg"?"⛰️":y==="flach"?"🟢":y==="zeitfahren"?"⏱️":"🟡";
export const tL=y=>y==="berg"?"Bergetappe":y==="flach"?"Flachetappe":y==="zeitfahren"?"Zeitfahren":"Hügelig";
export const fD=d=>{const p=d.split("-");return`${p[2]}.${p[1]}.`;};
export const gI=n=>{const p=n.split(" ");return p.length===1?p[0].slice(0,2).toUpperCase():(p[0][0]+p[p.length-1][0]).toUpperCase();};
export const isDL=s=>{const[y,m,d]=s.d.split("-").map(Number);const[h,mn]=s.tm.split(":").map(Number);return new Date()>=new Date(y,m-1,d,h,mn-5);};
export const dlStr=s=>{const[h,mn]=s.tm.split(":").map(Number);const dm=mn-5<0?55+mn:mn-5;const dh=mn-5<0?h-1:h;return`${String(dh).padStart(2,"0")}:${String(dm).padStart(2,"0")} Uhr`;};

export const cSP=(tip,res)=>{
  if(!tip||!res)return{total:0,bd:[]};
  const bd=[];let tot=0;const lb=["1. Platz","2. Platz","3. Platz"];const ep=[PTS.e1,PTS.e2,PTS.e3];
  [0,1,2].forEach(i=>{
    const r=gR(tip[i]);const nm=r?.n||"—";
    if(tip[i]===res[i]){bd.push({r:nm,l:`🎯 ${lb[i]} exakt`,p:ep[i]});tot+=ep[i];}
    else if(res.includes(tip[i])){bd.push({r:nm,l:"↕️ Richtig, falsche Pos.",p:PTS.wp});tot+=PTS.wp;}
    else{const tr=r;const rrs=res.map(gR);
      if(tr&&rrs.some(rr=>rr&&rr.t===tr.t)){bd.push({r:nm,l:"👕 Richtiges Team",p:PTS.rt});tot+=PTS.rt;}
      else bd.push({r:nm,l:"✗ Daneben",p:0});
    }
  });return{total:tot,bd};
};

export const Badge = ({ id, sz = 34 }) => {
  const r = gR(id);
  const t = r ? gT(r.t) : null;
  if (!r || !t) return (<div style={{ width: sz, height: sz, borderRadius: "50%", background: "#222", flexShrink: 0 }} />);
  return (
    <div style={{ width: sz, height: sz, borderRadius: "50%", background: t.bg, color: t.fg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: sz * .35, fontWeight: 800, letterSpacing: .5, fontFamily: "'Bebas Neue',sans-serif", border: `2px solid ${t.fg}40`, flexShrink: 0 }}>
      {gI(r.n)}
    </div>
  );
};

// Functions to update teams/riders from Supabase
export function updateTeams(supabaseTeams) {
  T = supabaseTeams.map(t => ({
    id: t.id, n: t.name, s: t.short, bg: t.bg, fg: t.fg
  }));
}

export function updateRiders(supabaseRiders) {
  R = supabaseRiders.filter(r => r.active !== false).map(r => ({
    i: r.id, n: r.name, t: r.team_id
  }));
}
export function updateStages(supabaseStages) {
  ST = supabaseStages.map(s => ({
    id: s.id, d: s.date, tm: s.start_time, t: s.title, y: s.stage_type, km: s.km
  }));
}
