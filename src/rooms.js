// Trace coordinates use the rendered architectural L4 plan, 1824 px wide.
// A11.13b aligns to A11.13a at (+53,+660). 29 ft grid bay = 138 px.
// Written/user-confirmed measurements override traced geometry.
export const METRES_PER_TRACE_UNIT = 8.8392 / 138;
export const WALL_HEIGHT = 3.0; // user-approved uniform representation
export const POOL_LENGTH = 20; // user confirmation
export const rect = (x, z, w, d) => [[x,z],[x+w,z],[x+w,z+d],[x,z+d]];
const r = (id,name,category,polygon,kind,photos=[],extra={}) => ({id,name,category,polygon,kind,photos,bookingUrl:null,...extra});
export const rooms = [
 r('L4-83','Games room','Social',rect(266,326,132,150),'billiards',['2']),
 r('L4-75','Sports lounge','Social',rect(400,326,88,103),'sports',['12','13']),
 r('L4-52','Study centre','Social',[[500,247],[690,228],[690,300],[740,300],[740,392],[605,392],[605,306],[500,306]],'study',['14','15']),
 r('L4-86','Meeting room','Social',[[693,231],[743,226],[743,297],[693,297]],'meeting',[]),
 r('L4-79','Study booth 3','Social',rect(520,312,39,46),'studySmall',[]),
 r('L4-80','Study booth 2','Social',rect(561,314,38.42,39.96),'studySmall',[],{measurement:'2.461 × 2.559 m · drawing dimensions'}),
 r('L4-81','Study booth 1','Social',rect(561,357,38.4,37),'studySmall',[]),
 r('L4-53','Private dining','Social',[[747,225],[838,216],[838,359],[747,359]],'dining',['11']),
 r('L4-54','North amenity lounge','Social',[[843,257],[1082,257],[1082,426],[956,426],[956,372],[843,372]],'lounge',['8','9']),
 r('L4-57','Catering kitchen','Social',rect(843,375,110,51),'kitchen',['8']),
 r('L4-45','Games & golf lounge','Social',[[205,516],[270,516],[270,491],[457,491],[457,709],[205,709]],'golf',['45']),
 r('L4-40','Main lounge','Social',rect(278,754,163,139),'lounge',['48','41']),
 r('L4-70','Event suite 2','Social',rect(278,898,163,137),'event',['47']),
 r('L4-13','Event suite 3','Social',rect(278,1040,305,107),'event',['3','4']),
 r('L4-41','Private lounge','Social',rect(475,665,102,84),'lounge',['46']),
 r('L4-42','Dining lounge','Social',rect(475,754,104,139),'dining',['6']),
 r('L4-59','Training studio','Fitness',rect(750,476,92,105),'studio',['26']),
 r('L4-61','Treatment room 1','Wellness',rect(750,585,42,57),'treatment',[]),
 r('L4-62','Treatment room 2','Wellness',rect(797,585,45,57),'treatment',[]),
 r('L4-65','Operator office','Support',rect(750,646,92,82),'office',[]),
 r('L4-63','Main gym','Fitness',rect(858,463,288,422),'gym',['26','29'],{featured:true}),
 r('L4-78','Flex / yoga studio','Fitness',[[1277,463],[1496,463],[1496,563],[1437,563],[1437,549],[1277,549]],'yoga',['30']),
 r('L4-67','Cardio gym','Fitness',[[1277,553],[1437,553],[1437,839],[1331,839],[1331,721],[1277,721]],'cardio',['29','30'],{featured:true}),
 r('L4-69','Workshop','Social',rect(1472,754,69,126),'workshop',['34']),
 r('L4-66','Sports court','Fitness',[[1277,896],[1536,896],[1536,1097],[1491,1136],[1277,1136]],'court',['31'],{featured:true}),
 r('L4-turf','Outdoor training turf','Outdoor',rect(1160,463,107,433),'turf',['28'],{featured:true}),
 r('L4-pool-terrace','Pool terrace','Outdoor',rect(1160,900,107,211),'terrace',[]),
 r('L4-35','Change rooms','Wellness',rect(724,754,116,184),'change',['21']),
 r('L4-37','Bowling lanes','Social',rect(590,850,97.45,410),'bowling',['32'],{featured:true,measurement:'6.242 m south-end width · drawing dimension'}),
 r('L4-36','Indoor pool & hydrotherapy','Wellness',[[845,900],[1148,900],[1148,1344],[1006,1450],[845,1344]],'pool',['20'],{featured:true,measurement:'20 m lap pool · four lanes'}),
 r('L4-30','Sauna','Wellness',rect(720,1160,58,67),'sauna',['22']),
 r('L4-31','Second sauna','Wellness',rect(782,1160,58,67),'sauna',['22']),
 r('L4-32','Steam room','Wellness',rect(720,1260,58,65),'steam',['24']),
 r('L4-33','Second steam room','Wellness',rect(782,1260,58,65),'steam',['24']),
 r('L4-38','Movie theatre','Social',rect(450,1180,122,134),'theatre',['50']),
 r('L4-craft','Craft & library','Social',rect(278,1160,147,110),'craft',['6']),
 r('L4-kids','Children’s playroom','Social',rect(202,1290,201,151),'kids',['42','7'],{featured:true}),
 r('L4-15','Indoor play space','Social',rect(202,1450,201,96),'kids',['7']),
 r('L4-meeting-south','South meeting room','Social',rect(218,1571,117,143),'meeting',['44']),
 r('L4-music','Music room','Social',rect(340,1571,64,88),'music',['43']),
 r('L4-event-south','South party room','Social',[[452,1566],[635,1566],[647,1638],[612,1738],[452,1738]],'event',['51','3']),
 r('L4-south-terrace','South terrace','Outdoor',[[451,1745],[610,1745],[488,1855],[411,1775]],'terrace',['10','5']),
 r('L4-guest','Guest suites','Guest suites',[[748,1393],[843,1450],[993,1460],[714,1667],[658,1610]],'guest',[]),
 r('L4-west-terrace','West terraces','Outdoor',rect(201,755,66,507),'terrace',['10']),
 r('L4-north-terrace','North terrace','Outdoor',[[843,217],[1067,195],[1150,270],[1150,386],[1090,386],[1090,253],[843,253]],'terrace',['5']),
 r('L4-dog','Dog park','Outdoor',[[1670,298],[1995,279],[2070,350],[1695,699],[1624,635],[1640,601],[1640,366],[1670,366]],'dog',['40'],{featured:true,detached:true}),
];

export const slabOutline = [[260,287],[491,287],[491,242],[1067,195],[1155,273],[1155,407],[1537,407],[1537,751],[1546,751],[1546,1099],[1498,1144],[1148,1395],[995,1470],[694,1694],[610,1750],[488,1860],[399,1775],[399,1720],[201,1720],[201,369],[260,369]];
export const cores = [
 {name:'Tower 2 circulation',rect:[474,445,162,182],lifts:6},
 {name:'Tower 1 circulation',rect:[421,1342,181,175],lifts:6},
 {name:'Services north',rect:[647,467,91,154]},
 {name:'Services middle',rect:[596,666,111,78]},
 {name:'Services south',rect:[613,1395,108,147]},
];
export const majorLabels = ['L4-63','L4-67','L4-66','L4-36','L4-37','L4-40','L4-52','L4-83','L4-kids','L4-dog'];
export const categories = ['All spaces','Fitness','Wellness','Social','Outdoor','Guest suites'];
