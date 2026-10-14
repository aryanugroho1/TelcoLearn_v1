---
topic_key: nokia_sran_mrbts_system_parameters
title: Nokia SRAN MRBTS System & Common Platform Parameters (25R2)
source_vendor: nokia
doc_type: parameter
technology: 4g_5g
category: parameter_tuning
keywords: nokia, mrbts, sran, system module, common, gps, synchronization, 25r2
summary: Daftar parameter sistem dan platform umum Nokia Multi-Radio BTS (MRBTS) release 25R2.
---

# Nokia SRAN MRBTS System & Common Platform Parameters (25R2)

Daftar parameter sistem dan platform umum Nokia Multi-Radio BTS (MRBTS) release 25R2.

| Abbreviated Name | MO Class | Full Name | Default Value | Range / Unit | Deskripsi Parameter |
|---|---|---|---|---|---|
| **`altitude`** | `MRBTS` | GPS antenna altitude | - | -500...18000, step 1 m | Altitude of site. |
| **`autoConHWId`** | `MRBTS` | Auto connection hardware ID from BTS | - | 1...4000 characters | BTS Auto connection hardware ID is System Module Core Assembly serial number : always present in FSM HW. |
| **`autoConSiteId`** | `MRBTS` | Auto connection site ID from BTS | - | 1...50 characters | Auto connection site ID is inserted by operator using element manager during auto connection. |
| **`autoConfBlocked`** | `MRBTS` | Auto configuration blocked | - | 0 (false), 1 (true) | This parameter indicates if Auto Configuration is allowed or blocked by a local installer working at the site. |
| **`autoConfStatus`** | `MRBTS` | Autoconfiguration status | - | 0:Not started;
1:Planning started;
2:Planning failed;
3:Planning interrupted;
4:Planning completed;
5:Autoconnection started;
6:Autoconnection finished;
7:Autoconnection failed;
8:Software download started;
9:Software installation finished;
10:Software installation failed;
11:Configuration download started;
12:Configuration activation started;
13:Configuration activation failed;
14:Autoconfiguration completed;
15:Autoconfiguration blocked | This parameter indicates the status of the BTS autoconfiguration operation. The values are set automatically during the BTS Autoconfiguration process. |
| **`blockingState`** | `MRBTS` | Blocking state | - | 0:Blocked;
1:Unblocked;
2:Blocking;
3:Unblocking | This parameter indicates blocking state of the BTS. |
| **`btsName`** | `MRBTS` | BTS name | - | 1...80 characters | This parameter can be used for identification of the BTS. It is used for planning purposes, i.e. to provide identification information of the site. It is not used for any Telecom purposes.  The range  |
| **`commissioningRequired`** | `MRBTS` | Autoconfiguration required by multiradio flexi BTS | - | 0 (false), 1 (true) | Multiradio Flexi BTS creates this parameter with value True when it is ready for Auto Configuration. This parameter is relevant only when Multiradio Flexi BTS is not commissioned. |
| **`dnPrefix`** | `MRBTS` | Distinguished name prefix | - | 1...400 characters | This parameter defines ManagedElement attribute dnPrefix according to 3GPP specification. |
| **`latitude`** | `MRBTS` | GPS antenna latitude | - | -900000000...900000000, step 1 | Latitude of site.  Latitude can be presented as degrees, minutes and seconds in GUIs or in a 7 decimal integer as stored in the SCF.  Latitude in decimal degrees format has 7 decimal places and is equ |
| **`locationName`** | `MRBTS` | Location name | - | 1...400 characters | This parameter defines ManagedElement attribute locationName according to 3GPP specification. |
| **`longitude`** | `MRBTS` | GPS antenna longitude | - | -1800000000...1800000000, step 1 | Longitude of site.  Longitude can be presented as degrees, minutes and seconds in GUIs or in a 7 decimal integer as stored in the SCF.  Longitude in decimal degrees format has 7 decimal places and is  |
| **`mrbtsId`** | `MRBTS` | Multi Radio BTS Instance Id | - | 0...4294967295, step 1 | This is the instance identifier of MRBTS object. |
| **`neType`** | `MRBTS` | NE type | - | 1...80 characters | This parameter can be used for customizing the identification of a Network Element type. It is not used for any Telecom purpose. |
| **`priorityLabel`** | `MRBTS` | Priority label | - | 1...400 characters | This parameter defines ManagedElement attribute priorityLabel according to 3GPP specification. |
| **`swVersion`** | `MRBTS` | Software version | - | 1...400 characters | This parameter defines ManagedElement attribute swVersion according to 3GPP specification. |
| **`userDefinedState`** | `MRBTS` | User defined state | - | 1...400 characters | This parameter defines ManagedElement attribute userDefinedState according to 3GPP specification. |
| **`vendorName`** | `MRBTS` | Vendor name | - | 1...400 characters | This parameter defines ManagedElement attribute vendorName according to 3GPP specification. |
| **`actNcYgMPlane`** | `MRBTS/MNL` | Activate NetConf/YANG M-Plane connection | - | 0 (false), 1 (true) | This parameter activates/deactivates possibility to use NetConf/YANG M-Plane interface. It defines whether the NE is allowed to use NetConf/YANG interface towards RU. |
| **`actPassivePartSync`** | `MRBTS/MNL` | Activate passive partition sync | - | 0 (false), 1 (true) | This parameter activates SW/config synchronization between active and passive partition.  When set to "true", the BTS will sync active SW and configuration with passive partition periodically. Sync wi |
| **`cellReconfigurationTimer`** | `MRBTS/MNL` | Cell reconfiguration timer | 20 | 10...90, step 1 minutes | The parameter defines the time in minutes after the BTS startup during which an autonomous reset of cells requiring reconfiguration is allowed (regardless of other cell reset criteria) when it is nece |
| **`disableExtendedORUSupport`** | `MRBTS/MNL` | Disable extended support for O-RAN RU | - | 0 (false), 1 (true) | This parameter disables extended functionalities of BTS for O-RAN RU. The parameter should not be changed in regular operations if not agreed with Nokia to reduce Nokia O-RAN World Market Product func |
| **`disableORUHWValidation`** | `MRBTS/MNL` | Disable HW Validation for O-RAN RU | - | 0 (false), 1 (true) | This parameter disables Hardware validation for O-RAN RU  For NRBTS-vDU and 4g-vDU this parameter should not be configured or it should be set to FALSE  This feature has no effect for non O-RAN integr |
| **`fixMacAddress`** | `MRBTS/MNL` | Fix invalid MAC address on BTS | - | 0 (false), 1 (true) | This parameter is for fixing invalid MAC addresses on BTS. Replaces first 3 bytes of MAC from D6-EF-CD to 54-FA-96. When applicable, fix requires BTS restart and is permanent. |
| **`fronthaulIpPool`** | `MRBTS/MNL` | Fronthaul IP pool management | - | 1:pool A;
2:pool B;
3:pool C;
4:pool D | Fronthaul IP pool management defines the IP pool for RF sharing. This parameter is used only in RF sharing configuration and must be configured in RF sharing. Parameter value on both peer BTSs in RF s |
| **`mnlId`** | `MRBTS/MNL` | MNL instance identifier | 1 | 1...1, step 1 | This parameter identifies the management layer class. There is only one instance of class MNL. |
| **`plannedSWReleaseVersion`** | `MRBTS/MNL` | Planned software release version | - | 0...255 characters | The planned version of the BTS software release. This parameter can be assigned by the user to the plan to guarantee that the plan - once it is downloaded and validated in BTS Autoconfiguration prepar |
| **`postponeBTSResetUntilCCNSent`** | `MRBTS/MNL` | Postpone BTS Reset Until CCN Sent | - | 0 (false), 1 (true) | This parameter allows to enable postponing of the site reset until all the buffered configuration change notifications (CCNs) are sent to the NMS.  If the parameter is set to the value of 'true', the  |
| **`productVariantPlanned`** | `MRBTS/MNL` | Product variant planned | - | 10:sBTS;
40:fzmBTS;
41:fzcBTS;
32:5gCU;
34:5gvDU;
50:tetraBTS | This parameter is used to indicate the planned Network Element type. |
| **`requestedRUSW`** | `MRBTS/MNL` | Requested RU SW version | - | - | Structure to configure Requested O-RU SW Versions per Radio type (O-RU type is distinguished by vendorCode and productCode). Change in the structure is not taken into use immediately but on next radio |
| **`productCode`** | `MRBTS/MNL` | Product code | - | 1...80 characters | Radio Unit product code for which requestedSWVersion is expected by Operator |
| **`requestedSWVersion`** | `MRBTS/MNL` | Requested RU SW version | - | 1...250 characters | This parameter is used to provide what is an Operator requested SW Version to be used by Radio Unit. This parameter value must match with a value of VersionId parameter of SW Package imported to NMS.  |
| **`vendorCode`** | `MRBTS/MNL` | Vendor code | - | 1...2 characters | Radio Unit vendor code for which requestedSWVersion is expected by Operator |
| **`resetNeededForIpChange`** | `MRBTS/MNL` | Reset needed after application IP address change | - | 0 (false), 1 (true) | This parameter value decides if autonomous BTS reset is executed when any application IP address is changed. If the parameter is not configured or set to ‘false’, the modification of application IP ad |
| **`sequentialRuSwUpgrade`** | `MRBTS/MNL` | Sequential Radio Software Upgrade | - | 0 (false), 1 (true) | The parameter defines way how all required radio modules shall be upgraded. They can be upgraded one by one (sequentially) to minimize cell service outage or simultaneously. The parameter is valid for |
| **`syncSchedule`** | `MRBTS/MNL` | Configuration and SW synchronization to passive partition schedule | 14 | 10...365, step 1 DateTime | If "actPassivePartSync" parameter is set to true, it defines periodic schedule starting from activation. Passive partition will be synchronized every few days (value set by the operator) from activati |
| **`timeZone`** | `MRBTS/MNL` | Time zone | - | 0:(GMT-11) Etc/GMT+11;
3:(GMT-11) Pacific/Midway;
4:(GMT-11) Pacific/Niue;
5:(GMT-11) Pacific/Pago_Pago;
6:(GMT-11) Pacific/Samoa;
7:(GMT-11) US/Samoa;
8:(GMT-10) America/Adak;
9:(GMT-10) America/Atka;
10:(GMT-10) Etc/GMT+10;
11:(GMT-10) HST;
13:(GMT-10) Pacific/Honolulu;
14:(GMT-10) Pacific/Johnston;
15:(GMT-10) Pacific/Rarotonga;
16:(GMT-10) Pacific/Tahiti;
18:(GMT-10) US/Aleutian;
19:(GMT-10) US/Hawaii;
22:(GMT-9) America/Anchorage;
23:(GMT-9) America/Juneau;
24:(GMT-9) America/Nome;
25:(GMT-9) America/Yakutat;
26:(GMT-9) Etc/GMT+9;
27:(GMT-9) Pacific/Gambier;
30:(GMT-9) US/Alaska;
32:(GMT-8) America/Ensenada;
33:(GMT-8) America/Los_Angeles;
34:(GMT-8) America/Tijuana;
35:(GMT-8) America/Vancouver;
37:(GMT-8) Canada/Pacific;
39:(GMT-8) Etc/GMT+8;
40:(GMT-8) Mexico/BajaNorte;
42:(GMT-8) PST8PDT;
43:(GMT-8) Pacific/Pitcairn;
46:(GMT-8) US/Pacific;
48:(GMT-7) America/Boise;
49:(GMT-7) America/Cambridge_Bay;
51:(GMT-7) America/Dawson_Creek;
52:(GMT-7) America/Denver;
53:(GMT-7) America/Edmonton;
54:(GMT-7) America/Hermosillo;
55:(GMT-7) America/Inuvik;
56:(GMT-7) America/Mazatlan;
57:(GMT-7) America/Phoenix;
58:(GMT-7) America/Shiprock;
59:(GMT-7) America/Yellowknife;
60:(GMT-7) Canada/Mountain;
61:(GMT-7) Etc/GMT+7;
62:(GMT-7) MST;
63:(GMT-7) MST7MDT;
64:(GMT-7) Mexico/BajaSur;
65:(GMT-7) Navajo;
69:(GMT-7) US/Arizona;
70:(GMT-7) US/Mountain;
71:(GMT-6) America/Belize;
73:(GMT-6) America/Chicago;
74:(GMT-6) America/Costa_Rica;
75:(GMT-6) America/El_Salvador;
76:(GMT-6) America/Guatemala;
77:(GMT-6) America/Indiana/Knox;
78:(GMT-6) America/Indiana/Tell_City;
79:(GMT-6) America/Knox_IN;
80:(GMT-6) America/Managua;
81:(GMT-6) America/Menominee;
82:(GMT-6) America/Merida;
83:(GMT-6) America/Mexico_City;
84:(GMT-6) America/Monterrey;
85:(GMT-6) America/North_Dakota/Center;
86:(GMT-6) America/North_Dakota/New_Salem;
87:(GMT-6) America/Rainy_River;
88:(GMT-6) America/Rankin_Inlet;
89:(GMT-6) America/Regina;
90:(GMT-6) America/Swift_Current;
91:(GMT-6) America/Tegucigalpa;
92:(GMT-6) America/Winnipeg;
94:(GMT-6) CST6CDT;
95:(GMT-6) Canada/Central;
97:(GMT-6) Canada/Saskatchewan;
98:(GMT-6) Chile/EasterIsland;
99:(GMT-6) Etc/GMT+6;
100:(GMT-6) Mexico/General;
101:(GMT-6) Pacific/Easter;
102:(GMT-6) Pacific/Galapagos;
105:(GMT-6) US/Central;
106:(GMT-6) US/Indiana-Starke;
107:(GMT-5) America/Atikokan;
108:(GMT-5) America/Bogota;
109:(GMT-5) America/Cayman;
110:(GMT-5) America/Coral_Harbour;
111:(GMT-5) America/Detroit;
112:(GMT-5) America/Eirunepe;
113:(GMT-5) America/Fort_Wayne;
114:(GMT-5) America/Grand_Turk;
115:(GMT-5) America/Guayaquil;
116:(GMT-5) America/Havana;
117:(GMT-5) America/Indiana/Indianapolis;
118:(GMT-5) America/Indiana/Marengo;
119:(GMT-5) America/Indiana/Petersburg;
120:(GMT-5) America/Indiana/Vevay;
121:(GMT-5) America/Indiana/Vincennes;
122:(GMT-5) America/Indiana/Winamac;
123:(GMT-5) America/Indianapolis;
124:(GMT-5) America/Iqaluit;
125:(GMT-5) America/Jamaica;
126:(GMT-5) America/Kentucky/Louisville;
127:(GMT-5) America/Kentucky/Monticello;
128:(GMT-5) America/Lima;
129:(GMT-5) America/Louisville;
130:(GMT-5) America/Montreal;
131:(GMT-5) America/Nassau;
132:(GMT-5) America/New_York;
133:(GMT-5) America/Nipigon;
134:(GMT-5) America/Panama;
135:(GMT-5) America/Pangnirtung;
136:(GMT-5) America/Port-au-Prince;
137:(GMT-5) America/Porto_Acre;
139:(GMT-5) America/Rio_Branco;
140:(GMT-5) America/Thunder_Bay;
141:(GMT-5) America/Toronto;
142:(GMT-5) Brazil/Acre;
143:(GMT-5) Canada/Eastern;
144:(GMT-5) Cuba;
145:(GMT-5) EST;
146:(GMT-5) EST5EDT;
147:(GMT-5) Etc/GMT+5;
149:(GMT-5) Jamaica;
152:(GMT-5) US/East-Indiana;
153:(GMT-5) US/Eastern;
154:(GMT-5) US/Michigan;
156:(GMT-4) America/Anguilla;
157:(GMT-4) America/Antigua;
158:(GMT-4) America/Aruba;
159:(GMT-4) America/Asuncion;
160:(GMT-4) America/Barbados;
161:(GMT-4) America/Blanc-Sablon;
162:(GMT-4) America/Boa_Vista;
163:(GMT-4) America/Campo_Grande;
164:(GMT-4) America/Cuiaba;
165:(GMT-4) America/Curacao;
166:(GMT-4) America/Dominica;
167:(GMT-4) America/Glace_Bay;
168:(GMT-4) America/Goose_Bay;
169:(GMT-4) America/Grenada;
170:(GMT-4) America/Guadeloupe;
171:(GMT-4) America/Guyana;
172:(GMT-4) America/Halifax;
173:(GMT-4) America/La_Paz;
174:(GMT-4) America/Manaus;
175:(GMT-4) America/Marigot;
176:(GMT-4) America/Martinique;
177:(GMT-4) America/Moncton;
178:(GMT-4) America/Montserrat;
179:(GMT-4) America/Port_of_Spain;
180:(GMT-4) America/Porto_Velho;
181:(GMT-4) America/Puerto_Rico;
182:(GMT-4) America/Santiago;
183:(GMT-4) America/Santo_Domingo;
184:(GMT-4) America/St_Barthelemy;
185:(GMT-4) America/St_Kitts;
186:(GMT-4) America/St_Lucia;
187:(GMT-4) America/St_Thomas;
188:(GMT-4) America/St_Vincent;
189:(GMT-4) America/Thule;
190:(GMT-4) America/Tortola;
191:(GMT-4) America/Virgin;
193:(GMT-4) Atlantic/Bermuda;
195:(GMT-4) Brazil/West;
196:(GMT-4) Canada/Atlantic;
197:(GMT-4) Chile/Continental;
198:(GMT-4) Etc/GMT+4;
204:(GMT-3.5) Canada/Newfoundland;
206:(GMT-3) America/Araguaina;
207:(GMT-3) America/Argentina/Buenos_Aires;
208:(GMT-3) America/Argentina/Catamarca;
209:(GMT-3) America/Argentina/ComodRivadavia;
210:(GMT-3) America/Argentina/Cordoba;
211:(GMT-3) America/Argentina/Jujuy;
212:(GMT-3) America/Argentina/La_Rioja;
213:(GMT-3) America/Argentina/Mendoza;
214:(GMT-3) America/Argentina/Rio_Gallegos;
215:(GMT-3) America/Argentina/San_Juan;
216:(GMT-3) America/Argentina/San_Luis;
217:(GMT-3) America/Argentina/Tucuman;
218:(GMT-3) America/Argentina/Ushuaia;
219:(GMT-3) America/Bahia;
220:(GMT-3) America/Belem;
221:(GMT-3) America/Buenos_Aires;
222:(GMT-3) America/Catamarca;
223:(GMT-3) America/Cayenne;
224:(GMT-3) America/Cordoba;
225:(GMT-3) America/Fortaleza;
227:(GMT-3) America/Jujuy;
228:(GMT-3) America/Maceio;
229:(GMT-3) America/Mendoza;
230:(GMT-3) America/Miquelon;
231:(GMT-3) America/Montevideo;
232:(GMT-3) America/Paramaribo;
233:(GMT-3) America/Recife;
234:(GMT-3) America/Rosario;
235:(GMT-3) America/Sao_Paulo;
236:(GMT-3) Antarctica/Rothera;
238:(GMT-3) Brazil/East;
239:(GMT-3) Etc/GMT+3;
240:(GMT-2) America/Noronha;
241:(GMT-2) Atlantic/South_Georgia;
242:(GMT-2) Brazil/DeNoronha;
243:(GMT-2) Etc/GMT+2;
245:(GMT-1) Atlantic/Azores;
246:(GMT-1) Atlantic/Cape_Verde;
247:(GMT-1) Etc/GMT+1;
248:(GMT+0) Africa/Abidjan;
249:(GMT+0) Africa/Accra;
250:(GMT+0) Africa/Bamako;
251:(GMT+0) Africa/Banjul;
252:(GMT+0) Africa/Bissau;
254:(GMT+0) Africa/Conakry;
255:(GMT+0) Africa/Dakar;
257:(GMT+0) Africa/Freetown;
258:(GMT+0) Africa/Lome;
259:(GMT+0) Africa/Monrovia;
260:(GMT+0) Africa/Nouakchott;
261:(GMT+0) Africa/Ouagadougou;
262:(GMT+0) Africa/Sao_Tome;
263:(GMT+0) Africa/Timbuktu;
264:(GMT+0) America/Danmarkshavn;
265:(GMT+0) Atlantic/Canary;
266:(GMT+0) Atlantic/Faeroe;
267:(GMT+0) Atlantic/Faroe;
268:(GMT+0) Atlantic/Madeira;
269:(GMT+0) Atlantic/Reykjavik;
270:(GMT+0) Atlantic/St_Helena;
272:(GMT+0) Etc/GMT;
273:(GMT+0) Etc/GMT+0;
274:(GMT+0) Etc/GMT-0;
275:(GMT+0) Etc/GMT0;
276:(GMT+0) Etc/Greenwich;
277:(GMT+0) Etc/UCT;
278:(GMT+0) Etc/UTC;
279:(GMT+0) Etc/Universal;
280:(GMT+0) Etc/Zulu;
281:(GMT+0) Europe/Belfast;
283:(GMT+0) Europe/Guernsey;
284:(GMT+0) Europe/Isle_of_Man;
285:(GMT+0) Europe/Jersey;
286:(GMT+0) Europe/Lisbon;
287:(GMT+0) Europe/London;
288:(GMT+0) GB;
289:(GMT+0) GB-Eire;
290:(GMT+0) GMT;
291:(GMT+0) GMT0;
292:(GMT+0) Greenwich;
293:(GMT+0) Iceland;
294:(GMT+0) Portugal;
295:(GMT+0) UCT;
296:(GMT+0) UTC;
297:(GMT+0) Universal;
298:(GMT+0) WET;
299:(GMT+0) Zulu;
300:(GMT+1) Africa/Algiers;
301:(GMT+1) Africa/Bangui;
302:(GMT+1) Africa/Brazzaville;
303:(GMT+1) Africa/Ceuta;
304:(GMT+1) Africa/Douala;
305:(GMT+1) Africa/Kinshasa;
306:(GMT+1) Africa/Lagos;
307:(GMT+1) Africa/Libreville;
308:(GMT+1) Africa/Luanda;
309:(GMT+1) Africa/Malabo;
310:(GMT+1) Africa/Ndjamena;
311:(GMT+1) Africa/Niamey;
312:(GMT+1) Africa/Porto-Novo;
313:(GMT+1) Africa/Tunis;
315:(GMT+1) Arctic/Longyearbyen;
316:(GMT+1) Atlantic/Jan_Mayen;
317:(GMT+1) CET;
319:(GMT+1) Etc/GMT-1;
320:(GMT+1) Europe/Amsterdam;
321:(GMT+1) Europe/Andorra;
322:(GMT+1) Europe/Belgrade;
323:(GMT+1) Europe/Berlin;
324:(GMT+1) Europe/Bratislava;
325:(GMT+1) Europe/Brussels;
326:(GMT+1) Europe/Budapest;
327:(GMT+1) Europe/Copenhagen;
328:(GMT+1) Europe/Gibraltar;
329:(GMT+1) Europe/Ljubljana;
330:(GMT+1) Europe/Luxembourg;
331:(GMT+1) Europe/Madrid;
332:(GMT+1) Europe/Malta;
333:(GMT+1) Europe/Monaco;
334:(GMT+1) Europe/Oslo;
335:(GMT+1) Europe/Paris;
336:(GMT+1) Europe/Podgorica;
337:(GMT+1) Europe/Prague;
338:(GMT+1) Europe/Rome;
339:(GMT+1) Europe/San_Marino;
340:(GMT+1) Europe/Sarajevo;
341:(GMT+1) Europe/Skopje;
342:(GMT+1) Europe/Stockholm;
343:(GMT+1) Europe/Tirane;
344:(GMT+1) Europe/Vaduz;
345:(GMT+1) Europe/Vatican;
346:(GMT+1) Europe/Vienna;
347:(GMT+1) Europe/Warsaw;
348:(GMT+1) Europe/Zagreb;
349:(GMT+1) Europe/Zurich;
350:(GMT+1) MET;
351:(GMT+1) Poland;
353:(GMT+2) Africa/Blantyre;
354:(GMT+2) Africa/Bujumbura;
355:(GMT+2) Africa/Cairo;
356:(GMT+2) Africa/Gaborone;
357:(GMT+2) Africa/Harare;
358:(GMT+2) Africa/Johannesburg;
359:(GMT+2) Africa/Kigali;
360:(GMT+2) Africa/Lubumbashi;
361:(GMT+2) Africa/Lusaka;
362:(GMT+2) Africa/Maputo;
363:(GMT+2) Africa/Maseru;
364:(GMT+2) Africa/Mbabane;
365:(GMT+2) Africa/Tripoli;
367:(GMT+2) Asia/Beirut;
369:(GMT+2) Asia/Gaza;
371:(GMT+2) Asia/Jerusalem;
372:(GMT+2) Asia/Nicosia;
373:(GMT+2) Asia/Tel_Aviv;
375:(GMT+2) EET;
376:(GMT+2) Egypt;
377:(GMT+2) Etc/GMT-2;
378:(GMT+2) Europe/Athens;
379:(GMT+2) Europe/Bucharest;
380:(GMT+2) Europe/Chisinau;
381:(GMT+2) Europe/Helsinki;
383:(GMT+2) Europe/Kaliningrad;
384:(GMT+2) Europe/Kiev;
385:(GMT+2) Europe/Mariehamn;
386:(GMT+2) Europe/Nicosia;
387:(GMT+2) Europe/Riga;
388:(GMT+3) Europe/Simferopol;
389:(GMT+2) Europe/Sofia;
390:(GMT+2) Europe/Tallinn;
391:(GMT+2) Europe/Tiraspol;
392:(GMT+2) Europe/Uzhgorod;
393:(GMT+2) Europe/Vilnius;
394:(GMT+2) Europe/Zaporozhye;
395:(GMT+2) Israel;
396:(GMT+2) Libya;
398:(GMT+3) Africa/Addis_Ababa;
399:(GMT+3) Africa/Asmara;
400:(GMT+3) Africa/Asmera;
401:(GMT+3) Africa/Dar_es_Salaam;
402:(GMT+3) Africa/Djibouti;
403:(GMT+3) Africa/Kampala;
405:(GMT+3) Africa/Mogadishu;
406:(GMT+3) Africa/Nairobi;
407:(GMT+3) Antarctica/Syowa;
408:(GMT+3) Asia/Aden;
409:(GMT+3) Asia/Baghdad;
410:(GMT+3) Asia/Bahrain;
411:(GMT+3) Asia/Kuwait;
412:(GMT+3) Asia/Qatar;
413:(GMT+3) Asia/Riyadh;
415:(GMT+3) Etc/GMT-3;
416:(GMT+3) Europe/Minsk;
417:(GMT+3) Indian/Antananarivo;
418:(GMT+3) Indian/Comoro;
419:(GMT+3) Indian/Mayotte;
420:(GMT+3) W-SU;
421:(GMT+3.5) Asia/Tehran;
422:(GMT+3.5) Iran;
423:(GMT+4) Asia/Baku;
424:(GMT+4) Asia/Dubai;
425:(GMT+4) Asia/Muscat;
426:(GMT+4) Asia/Tbilisi;
427:(GMT+4) Asia/Yerevan;
428:(GMT+4) Etc/GMT-4;
429:(GMT+3) Europe/Moscow;
430:(GMT+4) Europe/Samara;
432:(GMT+4) Indian/Mahe;
433:(GMT+4) Indian/Mauritius;
434:(GMT+4) Indian/Reunion;
436:(GMT+4.5) Asia/Kabul;
437:(GMT+5) Asia/Aqtau;
438:(GMT+5) Asia/Aqtobe;
439:(GMT+5) Asia/Ashgabat;
440:(GMT+5) Asia/Ashkhabad;
441:(GMT+5) Asia/Dushanbe;
442:(GMT+5) Asia/Karachi;
443:(GMT+5) Asia/Oral;
444:(GMT+5) Asia/Samarkand;
445:(GMT+5) Asia/Tashkent;
446:(GMT+5) Etc/GMT-5;
447:(GMT+5) Indian/Kerguelen;
448:(GMT+5) Indian/Maldives;
450:(GMT+5.5) Asia/Calcutta;
451:(GMT+5.5) Asia/Colombo;
452:(GMT+5.5) Asia/Kolkata;
457:(GMT+6) Asia/Bishkek;
458:(GMT+6) Asia/Dacca;
459:(GMT+6) Asia/Dhaka;
461:(GMT+6) Asia/Thimbu;
462:(GMT+6) Asia/Thimphu;
465:(GMT+6) Etc/GMT-6;
466:(GMT+6) Indian/Chagos;
467:(GMT+6.5) Asia/Rangoon;
468:(GMT+6.5) Indian/Cocos;
469:(GMT+7) Antarctica/Davis;
470:(GMT+7) Asia/Bangkok;
471:(GMT+7) Asia/Ho_Chi_Minh;
472:(GMT+7) Asia/Hovd;
473:(GMT+7) Asia/Jakarta;
474:(GMT+7) Asia/Novosibirsk;
476:(GMT+7) Asia/Phnom_Penh;
477:(GMT+7) Asia/Pontianak;
478:(GMT+7) Asia/Saigon;
479:(GMT+7) Asia/Vientiane;
480:(GMT+7) Etc/GMT-7;
481:(GMT+7) Indian/Christmas;
484:(GMT+8) Asia/Brunei;
485:(GMT+8) Asia/Choibalsan;
486:(GMT+8) Asia/Chongqing;
487:(GMT+8) Asia/Chungking;
488:(GMT+8) Asia/Harbin;
489:(GMT+8) Asia/Hong_Kong;
492:(GMT+8) Asia/Kuala_Lumpur;
493:(GMT+8) Asia/Kuching;
494:(GMT+8) Asia/Macao;
495:(GMT+8) Asia/Macau;
496:(GMT+8) Asia/Makassar;
497:(GMT+8) Asia/Manila;
498:(GMT+8) Asia/Shanghai;
499:(GMT+8) Asia/Singapore;
500:(GMT+8) Asia/Taipei;
501:(GMT+8) Asia/Ujung_Pandang;
502:(GMT+8) Asia/Ulaanbaatar;
503:(GMT+8) Asia/Ulan_Bator;
505:(GMT+8) Australia/Perth;
506:(GMT+8) Australia/West;
508:(GMT+8) Etc/GMT-8;
509:(GMT+8) Hongkong;
510:(GMT+8) PRC;
511:(GMT+8) Singapore;
512:(GMT+9) Asia/Dili;
514:(GMT+9) Asia/Jayapura;
515:(GMT+9) Asia/Pyongyang;
516:(GMT+9) Asia/Seoul;
517:(GMT+9) Asia/Tokyo;
518:(GMT+9) Etc/GMT-9;
520:(GMT+9) Japan;
521:(GMT+9) Pacific/Palau;
522:(GMT+9) ROK;
524:(GMT+9.5) Australia/Adelaide;
525:(GMT+9.5) Australia/Broken_Hill;
526:(GMT+9.5) Australia/Darwin;
527:(GMT+9.5) Australia/North;
528:(GMT+9.5) Australia/South;
529:(GMT+9.5) Australia/Yancowinna;
531:(GMT+10) Antarctica/DumontDUrville;
533:(GMT+10) Australia/ACT;
534:(GMT+10) Australia/Brisbane;
535:(GMT+10) Australia/Canberra;
536:(GMT+10) Australia/Currie;
537:(GMT+10) Australia/Hobart;
538:(GMT+10) Australia/Lindeman;
539:(GMT+10) Australia/Melbourne;
540:(GMT+10) Australia/NSW;
541:(GMT+10) Australia/Queensland;
542:(GMT+10) Australia/Sydney;
543:(GMT+10) Australia/Tasmania;
544:(GMT+10) Australia/Victoria;
545:(GMT+10) Etc/GMT-10;
546:(GMT+10) Pacific/Guam;
547:(GMT+10) Pacific/Port_Moresby;
548:(GMT+10) Pacific/Saipan;
549:(GMT+10) Pacific/Truk;
550:(GMT+10) Pacific/Yap;
551:(GMT+10.5) Australia/LHI;
552:(GMT+10.5) Australia/Lord_Howe;
553:(GMT+11) Asia/Sakhalin;
555:(GMT+11) Etc/GMT-11;
556:(GMT+11) Pacific/Efate;
557:(GMT+11) Pacific/Guadalcanal;
558:(GMT+11) Pacific/Kosrae;
559:(GMT+11) Pacific/Noumea;
560:(GMT+11) Pacific/Ponape;
563:(GMT+12) Antarctica/McMurdo;
564:(GMT+12) Antarctica/South_Pole;
565:(GMT+12) Asia/Anadyr;
566:(GMT+12) Asia/Kamchatka;
568:(GMT+12) Etc/GMT-12;
569:(GMT+12) Kwajalein;
571:(GMT+12) NZ;
572:(GMT+12) Pacific/Auckland;
573:(GMT+12) Pacific/Fiji;
574:(GMT+12) Pacific/Funafuti;
575:(GMT+12) Pacific/Kwajalein;
576:(GMT+12) Pacific/Majuro;
577:(GMT+12) Pacific/Nauru;
578:(GMT+12) Pacific/Tarawa;
579:(GMT+12) Pacific/Wake;
580:(GMT+12) Pacific/Wallis;
585:(GMT+13) Pacific/Apia;
590:(GMT-9.5) Pacific/Marquesas;
595:(GMT-4) America/Caracas;
600:(GMT-3.5) America/St_Johns;
605:(GMT+2) Africa/Juba;
610:(GMT-3) America/Argentina/Salta;
615:(GMT-6) America/Bahia_Banderas;
620:(GMT-7) America/Ciudad_Juarez;
625:(GMT-7) America/Creston;
630:(GMT-7) America/Fort_Nelson;
635:(GMT-4) America/Kralendijk;
640:(GMT-4) America/Lower_Princes;
645:(GMT-6) America/Matamoros;
650:(GMT-9) America/Metlakatla;
655:(GMT-6) America/North_Dakota/Beulah;
665:(GMT-6) America/Ojinaga;
670:(GMT-3) America/Punta_Arenas;
675:(GMT-8) America/Santa_Isabel;
680:(GMT-3) America/Santarem;
685:(GMT-9) America/Sitka;
690:(GMT+10) Antarctica/Macquarie;
695:(GMT+0) Antarctica/Troll;
700:(GMT+5) Asia/Atyrau;
705:(GMT+7) Asia/Barnaul;
710:(GMT+9) Asia/Chita;
715:(GMT+2) Asia/Famagusta;
720:(GMT+2) Asia/Hebron;
725:(GMT+5.75) Asia/Kathmandu;
730:(GMT+5.75) Asia/Katmandu;
735:(GMT+9) Asia/Khandyga;
740:(GMT+7) Asia/Novokuznetsk;
750:(GMT+11) Asia/Srednekolymsk;
755:(GMT+7) Asia/Tomsk;
760:(GMT+10) Asia/Ust-Nera;
765:(GMT+6.5) Asia/Yangon;
770:(GMT+8.75) Australia/Eucla;
775:(GMT-12) Etc/GMT+12;
780:(GMT+13) Etc/GMT-13;
785:(GMT+14) Etc/GMT-14;
790:(GMT+4) Europe/Astrakhan;
795:(GMT+1) Europe/Busingen;
800:(GMT+3) Europe/Kirov;
805:(GMT+2) Europe/Kyiv;
810:(GMT+4) Europe/Saratov;
815:(GMT+4) Europe/Ulyanovsk;
820:(GMT+0) GMT+0;
825:(GMT+0) GMT-0;
830:(GMT+12.75) NZ-CHAT;
835:(GMT+11) Pacific/Bougainville;
840:(GMT+12.75) Pacific/Chatham;
845:(GMT+10) Pacific/Chuuk;
850:(GMT+13) Pacific/Enderbury;
855:(GMT+13) Pacific/Kanton;
860:(GMT+14) Pacific/Kiritimati;
865:(GMT+11) Pacific/Pohnpei;
870:(GMT+13) Pacific/Tongatapu;
875:(GMT+8) ROC;
900:(GMT+1) Africa/Casablanca;
905:(GMT+1) Africa/El_Aaiun;
910:(GMT+2) Africa/Khartoum;
915:(GMT+2) Africa/Windhoek;
920:(GMT-5) America/Cancun;
925:(GMT-6) America/Chihuahua;
930:(GMT-7) America/Dawson;
935:(GMT-2) America/Godthab;
940:(GMT-6) America/Resolute;
945:(GMT-7) America/Whitehorse;
955:(GMT+5) Antarctica/Mawson;
960:(GMT-3) Antarctica/Palmer;
965:(GMT+3) Asia/Amman;
970:(GMT+3) Asia/Damascus;
975:(GMT+8) Asia/Irkutsk;
980:(GMT+3) Asia/Istanbul;
985:(GMT+6) Asia/Kashgar;
990:(GMT+7) Asia/Krasnoyarsk;
995:(GMT+11) Asia/Magadan;
1000:(GMT+6) Asia/Omsk;
1005:(GMT+5) Asia/Qyzylorda;
1010:(GMT+6) Asia/Urumqi;
1015:(GMT+10) Asia/Vladivostok;
1020:(GMT+9) Asia/Yakutsk;
1025:(GMT+5) Asia/Yekaterinburg;
1030:(GMT-3) Atlantic/Stanley;
1035:(GMT-7) Canada/Yukon;
1040:(GMT+1) Eire;
1045:(GMT+1) Europe/Dublin;
1050:(GMT+3) Europe/Istanbul;
1055:(GMT+3) Europe/Volgograd;
1060:(GMT+13) Pacific/Fakaofo;
1065:(GMT+11) Pacific/Norfolk;
1070:(GMT+3) Turkey;
1071:(GMT+5) Asia/Qostanay;
1073:(GMT+5) Antarctica/Vostok;
483:(GMT+8) Antarctica/Casey;
1074:(GMT-1) America/Nuuk | This parameter defines the Time Zone used.  It is presented as an enumeration. For example, for Helsinki, the value is 381 corresponding to (GMT+2) Europe/Helsinki.  Current timezones are defined acco |
| **`tmpActFeat1`** | `MRBTS/MNL` | Temporary activation flags 1 | - | Bit 0:Bit 0:0:; Bit 1:Bit 1:0:; Bit 2:Bit 2:0:; Bit 3:Bit 3:0:; 
Bit 4:Bit 4:0:; Bit 5:Bit 5:0:; Bit 6:Bit 6:0:; Bit 7:Bit 7:0:; 
Bit 8:Bit 8:0:; Bit 9:Bit 9:0:; Bit 10:Bit 10:0:; Bit 11:Bit 11:0:; 
Bit 12:Bit 12:0:; Bit 13:Bit 13:0:; Bit 14:Bit 14:0:; Bit 15:Bit 15:0:; 
Bit 16:Bit 16:0:; Bit 17:Bit 17:0:; Bit 18:Bit 18:0:; Bit 19:Bit 19:0:; 
Bit 20:Bit 20:0:; Bit 21:Bit 21:0:; Bit 22:Bit 22:0:; Bit 23:Bit 23:0:; 
Bit 24:Bit 24:0:; Bit 25:Bit 25:0:; Bit 26:Bit 26:0:; Bit 27:Bit 27:0:; 
Bit 28:Bit 28:0:; Bit 29:Bit 29:0:; Bit 30:Bit 30:0:; Bit 31:Bit 31:0: | This parameter is prepared for late and urgent feature enhancements. It is used to enable dedicated functionality in the BTS. |
| **`tmpActFeat2`** | `MRBTS/MNL` | Temporary activation flags 2 | - | Bit 0:Bit 0:0:; Bit 1:Bit 1:0:; Bit 2:Bit 2:0:; Bit 3:Bit 3:0:; 
Bit 4:Bit 4:0:; Bit 5:Bit 5:0:; Bit 6:Bit 6:0:; Bit 7:Bit 7:0:; 
Bit 8:Bit 8:0:; Bit 9:Bit 9:0:; Bit 10:Bit 10:0:; Bit 11:Bit 11:0:; 
Bit 12:Bit 12:0:; Bit 13:Bit 13:0:; Bit 14:Bit 14:0:; Bit 15:Bit 15:0:; 
Bit 16:Bit 16:0:; Bit 17:Bit 17:0:; Bit 18:Bit 18:0:; Bit 19:Bit 19:0:; 
Bit 20:Bit 20:0:; Bit 21:Bit 21:0:; Bit 22:Bit 22:0:; Bit 23:Bit 23:0:; 
Bit 24:Bit 24:0:; Bit 25:Bit 25:0:; Bit 26:Bit 26:0:; Bit 27:Bit 27:0:; 
Bit 28:Bit 28:0:; Bit 29:Bit 29:0:; Bit 30:Bit 30:0:; Bit 31:Bit 31:0: | This parameter is prepared for late and urgent feature enhancements. It is used to enable dedicated functionality in the BTS. |
| **`tmpParam1`** | `MRBTS/MNL` | Temporary parameter 1 | - | 0...65535, step 1 | This parameter is prepared for late and urgent feature enhancements. |
| **`tmpParam10`** | `MRBTS/MNL` | Temporary parameter 10 | - | 0...65535, step 1 | This parameter is prepared for late and urgent feature enhancements. |
| **`tmpParam2`** | `MRBTS/MNL` | Temporary parameter 2 | - | 0...65535, step 1 | In this SW release (FSMF), this parameter activates the security Radio Unit(s) marking functionality.  When configured, the values shall be equal to one the following: - '0': The Radio Unit(s) marking |
| **`tmpParam3`** | `MRBTS/MNL` | Temporary parameter 3 | - | 0...65535, step 1 | This parameter is prepared for late and urgent feature enhancements. |
| **`tmpParam4`** | `MRBTS/MNL` | Temporary parameter 4 | - | 0...65535, step 1 | This parameter is prepared for late and urgent feature enhancements. |
| **`tmpParam5`** | `MRBTS/MNL` | Temporary parameter 5 | - | 0...65535, step 1 | This parameter is prepared for late and urgent feature enhancements. |
| **`tmpParam6`** | `MRBTS/MNL` | Temporary parameter 6 | - | 0...65535, step 1 | This parameter is prepared for late and urgent features enhancements. |
| **`tmpParam7`** | `MRBTS/MNL` | Temporary parameter 7 | - | 0...65535, step 1 | This parameter is prepared for late and urgent feature enhancements. |
| **`tmpParam8`** | `MRBTS/MNL` | Temporary parameter 8 | - | 0...65535, step 1 | This parameter is prepared for late and urgent feature enhancements. |
| **`tmpParam9`** | `MRBTS/MNL` | Temporary parameter 9 | - | 0...65535, step 1 | This parameter is prepared for late and urgent feature enhancements. |
| **`tmpStrParam1`** | `MRBTS/MNL` | Temporary string parameter 1 | - | 1...4000 characters | This parameter is prepared for late and urgent feature enhancements. |
| **`tmpStrParam2`** | `MRBTS/MNL` | Temporary string parameter 2 | - | 1...4000 characters | This parameter is prepared for late and urgent feature enhancements. |
| **`userLabel`** | `MRBTS/MNL` | User label | - | 0...255 characters | This parameter denotes a label that can be used for a user friendly name of the software configuration version |
| **`validatePlanAgainstDetectedHW`** | `MRBTS/MNL` | Validate plan against detected hardware | - | 0 (false), 1 (true) | Perform configuration plan validation against the hardware detected by the BTS.   This parameter indicates whether or not planned configuration changes are validated against the capabilities of the ha |
| **`validationScope`** | `MRBTS/MNL` | Validation scope | - | 0:Delta Check;
1:Full Check | This parameter defines scope of pre-validation or validation for delta configuration plan. 'Delta Check' means that only validation rules related to parameters from delta plan shall be run. 'Full Chec |
| **`actCnumLdapClientAcctSup`** | `MRBTS/MNL/AMGR` | Activate CNUM LDAP client account supervision | - | 0 (false), 1 (true) | This parameter enables the supervision of the CNUM LDAP client account settings. |
| **`amgrId`** | `MRBTS/MNL/AMGR` | User account management object identifier | - | 1...1, step 1 | This parameter identifies the account manager. |
| **`btsEMRestrictedAccess`** | `MRBTS/MNL/AMGR` | Activate restricted access | - | 0 (false), 1 (true) | This parameter enables/disables the restricted access policy which limits the number of read/write BTS EM sessions to one. |
| **`btsEMRestrictedAccessLogoutTimer`** | `MRBTS/MNL/AMGR` | BTS EM restricted access logout timer | 60 | 10...600, step 1 Second | This parameter defines the amount of time in seconds the BTS waits before BTS EM users are disconnected under the restricted access policy. This parameter is valid only if btsEMRestrictedAccess is set |
| **`checkCnumPasswdExpiry`** | `MRBTS/MNL/AMGR` | Check CNUM password expiry policy | - | 0 (false), 1 (true) | This parameter determines whether BTS checks the password aging related information for CNUM accounts returned by LDAP server. |
| **`cnumActivationStatus`** | `MRBTS/MNL/AMGR` | CNUM activation status | - | 0 (false), 1 (true) | This parameter indicates the activation status of the CNUM server.  Note: BTS recovers the previous state from NetAct after a swap. |
| **`enableCnumLdapCtrlAlarm`** | `MRBTS/MNL/AMGR` | Enable CNUM LDAP connectivity control alarm | - | 0 (false), 1 (true) | This parameter activates the fault generation when the CNUM LDAP server is not reachable. |
| **`enableDefaultPasswdAlarm`** | `MRBTS/MNL/AMGR` | Enable default password alarm | - | 0 (false), 1 (true) | This parameter detects the condition when the Nokia default password is in use for any of the following BTS user accounts: Local Operator System Administrator (Nemuadmin), Root Service User (toor4nsn) |
| **`ldapConnectionType`** | `MRBTS/MNL/AMGR` | LDAP server TLS access mode | - | 0:TLS;
1:TLS_OR_PLAIN_TEXT | This parameter holds the TLS access mode for the LDAP server(s) of the BTS. The values are "TLS" (allows only secured connections) and "TLS_OR_PLAIN_TEXT" (allow both unsecured and secured connections |
| **`ldapPortPrimary`** | `MRBTS/MNL/AMGR` | Port number of the primary LDAP server | 389 | 1...65535, step 1 | This parameter holds the port number of the primary LDAP server. |
| **`ldapServerPrimary`** | `MRBTS/MNL/AMGR` | IP address of the primary LDAP server | - | 2...45 characters | This parameter holds the IP address of the primary LDAP server. The IPv4 is in dotted decimal format or IPv6 in format defined in RFC4291. |
| **`minNonAlphaNumInPassword`** | `MRBTS/MNL/AMGR` | Minimum number of non alphanumeric characters in  local or service user password | 1 | 0...2, step 1 | This parameter represents the minimum number of non alphanumeric characters in any local or service user password. Note: The change will be forced the next time the password is updated, not the next t |
| **`minPasswordLength`** | `MRBTS/MNL/AMGR` | Minimum local or service user Password Length | 8 | 8...128, step 1 | This parameter represents the minimum length of any local or service user password. Note: The change will be forced the next time the password is updated, not the next time you log in. |
| **`actRestrictLoginToCnum`** | `MRBTS/MNL/AMGR/LUAC` | Activate restrict login to CNUM | - | 0 (false), 1 (true) | This flag activates the Login Restriction with CNUM feature. When this feature is enabled, the local user account is blocked from logging in if CNUM is available for centralized user login.  This appl |
| **`allowLocalUserDefaultPassword`** | `MRBTS/MNL/AMGR/LUAC` | Allow local user default password | 1 | 0 (false), 1 (true) | This configuration parameter determines the feature flag for enforcing the mandatory update of the local operator system administrator 'Nemuadmin', non-root service user 'serviceuser' and root service |
| **`appAdmActivated`** | `MRBTS/MNL/AMGR/LUAC` | Activate BTS Application Administrator local user | - | 0 (false), 1 (true) | The local user with BTS Application Administrator is deactivated by default and can be activated when required. |
| **`appAdmLocalPasswdLastChangedTime`** | `MRBTS/MNL/AMGR/LUAC` | BTS Application Administrator local password last changed time | - | 1...26 characters | This parameter displays the time at which the password of the BTS Application Administrator local user was last changed on BTS. This parameter is updated to the local time on BTS when a) the BTS Appli |
| **`btsAccountLockoutDuration`** | `MRBTS/MNL/AMGR/LUAC` | BTS account lockout duration | 15 | 1...1440, step 1 minutes | This parameter defines the timer in minutes for locking the BTS local (operator) user account or Data Collection User (dcuser) account when the number of the failed login attempts exceeds the defined  |
| **`btsEMMaxSimulSession`** | `MRBTS/MNL/AMGR/LUAC` | BTS EM Maximum Simultaneous Sessions Allowed | 10 | 1...10, step 1 | This parameter defines the number of maximum sessions allowed from the BTS EM. |
| **`btsFailedLoginCountingPeriod`** | `MRBTS/MNL/AMGR/LUAC` | BTS failed login counting period | 5 | 1...1440, step 1 minutes | This parameter defines the timer in minutes for tracking the failed login attempts on a BTS local (operator) user account or Data Collection User (dcuser) account. The timer is automatically reset to  |
| **`btsMaxFailedLoginAttempts`** | `MRBTS/MNL/AMGR/LUAC` | BTS maximum failed login attempts | 5 | 0...10, step 1 | This parameter defines the maximum number of failed login attempts allowed for a BTS local (operator) user account or a Data Collection User (dcuser) account. If there are more failed login attempts d |
| **`btsSessionLoginDelay`** | `MRBTS/MNL/AMGR/LUAC` | BTS session login delay | 1 | 1...10, step 1 s | This parameter defines the delay after a failed login attempt on the BTS Element Manager or Data Collection Control (DCC) interface before the next login is permitted.  Note: If the parameter LUAC.bts |
| **`enableUserAccountCtrlAlarm`** | `MRBTS/MNL/AMGR/LUAC` | Enable user account control alarm | - | 0 (false), 1 (true) | This parameter detects the condition when a user logs in successfully with a local operator user account when CNUM is enabled and also controls whether the BTS should raise the alarm 7220/fault 4775 w |
| **`localPasswdExpiryPeriod`** | `MRBTS/MNL/AMGR/LUAC` | Local password expiry period | - | 0...9999, step 1 | This parameter defines the number of days after the last local account password change when the local user account password will expire. LUAC-localPasswdWarningPeriod must be less than LUAC-localPassw |
| **`localPasswdWarningPeriod`** | `MRBTS/MNL/AMGR/LUAC` | Local password warning period | - | 0...9998, step 1 | This parameter defines the number of days before the local account expiry time, when a login of a local user account enters the about to expire state.  LUAC-localPasswdWarningPeriod must be less than  |
| **`localUserAllowedIdlePeriod`** | `MRBTS/MNL/AMGR/LUAC` | Local user allowed idle period | - | 1...9999, step 1 days | This parameter defines the number of days after which the BTS Security Administrator, the BTS Application Administrator and the BTS Read Only user accounts will go into unusable state if no activity ( |
| **`localUserAllowedLifetime`** | `MRBTS/MNL/AMGR/LUAC` | Local user allowed lifetime | - | 1...9999, step 1 days | This parameter defines the number of days after which the BTS Security Administrator, the BTS Application Administrator and the BTS Read Only user accounts will go into unusable state. The account wil |
| **`luacId`** | `MRBTS/MNL/AMGR/LUAC` | Local user account identifier | - | 1...1, step 1 | This parameter identifies the local user account configuration of the BTS. It is always 1. |
| **`maxUserNameLength`** | `MRBTS/MNL/AMGR/LUAC` | Maximum user name length | 16 | 4...16, step 1 | This parameter defines the maximum length of user account name mapped to service type (BTS Account Access). |
| **`minUserNameLength`** | `MRBTS/MNL/AMGR/LUAC` | Minimum user name length | 4 | 4...16, step 1 | This parameter defines the minimum length of user account name mapped to service type (BTS Account Access). |
| **`readOnlyActivated`** | `MRBTS/MNL/AMGR/LUAC` | Activate BTS Read-Only local user | - | 0 (false), 1 (true) | The BTS Read-Only local user is deactivated by default and can be activated when required. |
| **`readOnlyLocalPasswdLastChangedTime`** | `MRBTS/MNL/AMGR/LUAC` | BTS Read-Only local password last changed time | - | 1...26 characters | This parameter displays the time at which the password of the BTS Read-Only local user was last changed on BTS. This parameter is updated to the local time on BTS when a) the BTS Read-Only local user  |
| **`secAdmActivated`** | `MRBTS/MNL/AMGR/LUAC` | Activate BTS Security Administrator local user | - | 0 (false), 1 (true) | The local user of BTS Security Administrator is deactivated by default and can be activated when required. |
| **`secAdmLocalPasswdLastChangedTime`** | `MRBTS/MNL/AMGR/LUAC` | BTS Security Administrator local password last changed time | - | 1...26 characters | This parameter displays the time at which the password of the BTS Security Administrator local user was last changed on BTS. This parameter is updated to the local time on BTS when a) the BTS Security |
| **`sysAdmAllowedIdlePeriod`** | `MRBTS/MNL/AMGR/LUAC` | System administrator allowed idle period | - | 1...9999, step 1 days | This parameter defines the number of days after which the BTS system administrator account will go into unusable state if no activity (account login) happens within this number of days. The account wi |
| **`sysAdmAllowedLifetime`** | `MRBTS/MNL/AMGR/LUAC` | System administrator allowed lifetime | - | 1...9999, step 1 days | This parameter defines the number of days after which the BTS system administrator account will go into unusable state. The account will go into disabled state at 00:00:00 UTC. The account allowed lif |
| **`webEMSessionLogoutTimer`** | `MRBTS/MNL/AMGR/LUAC` | WebEM session logout timer | 900 | 120...7200, step 1 Seconds | This parameter defines the amount of waiting time for user inactivity before initiating the automatic logoff procedure for the WebEM user. |
| **`appAdmIdlePerExpDate`** | `MRBTS/MNL/AMGR/LUAC/LUAC_R` | Application administrator idle period expiry date | - | 10...10 characters | This parameter indicates the date at which the BTS Application Administrator account will go into disabled state if no activity (account login) happens before this date. The account will go into disab |
| **`localPasswdLastChangedTime`** | `MRBTS/MNL/AMGR/LUAC/LUAC_R` | Local password last changed time | - | 1...26 characters | This parameter displays the time at which the local password on BTS was last changed. This parameter is updated to the local time on BTS when BTS is time synced, and: -the local user password is chang |
| **`localUserLifetimeExpDate`** | `MRBTS/MNL/AMGR/LUAC/LUAC_R` | Local user lifetime expiry date | - | 10...10 characters | This parameter indicates the date at which the BTS Security Administrator, the BTS Application Administrator and the BTS Read Only user accounts will go into unusable state. The account will go into d |
| **`luacRId`** | `MRBTS/MNL/AMGR/LUAC/LUAC_R` | Local user account runtime object identifier | - | 1...1, step 1 | The identifier of the LUAC_R object. |
| **`readOnlyIdlePerExpDate`** | `MRBTS/MNL/AMGR/LUAC/LUAC_R` | Read only idle period expiry date | - | 10...10 characters | This parameter indicates the date at which the BTS Read Only user account will go into unusable state if no activity (account login) happens before this date. The account will go into disabled state a |
| **`secAdmIdlePerExpDate`** | `MRBTS/MNL/AMGR/LUAC/LUAC_R` | Security Administrator idle period expiry date | - | 10...10 characters | This parameter indicates the date at which the BTS Security Administrator account will go into unusable state if no activity (account login) happens before this date. The account will go into disabled |
| **`sysAdmIdlePerExpDate`** | `MRBTS/MNL/AMGR/LUAC/LUAC_R` | System administrator idle period expiry date | - | 10...10 characters | This parameter indicates the date at which the BTS System Administrator account will go into unusable state if no activity (account login) happens before this date. The account will go into disabled s |
| **`sysAdmLifetimeExpDate`** | `MRBTS/MNL/AMGR/LUAC/LUAC_R` | System administrator lifetime expiry date | - | 10...10 characters | This parameter indicates the date at which the BTS System Administrator account will go into unusable state. The account will go into disabled state at 00:00:00 UTC.  Note: It is calculated based on t |
| **`autoCBRSCertDelete`** | `MRBTS/MNL/CERTH` | Automatic deletion of CBRS root CA certificate | - | 0 (false), 1 (true) | This configuration parameter determines whether the old CBRS Root CA certificate is retained or deleted, after the installation of the new CBRS certificate trust chain into BTS. If it is set to "true" |
| **`autoCertDelete`** | `MRBTS/MNL/CERTH` | Automatic deletion of operator root CA certificate | - | 0 (false), 1 (true) | This configuration parameter determines whether the old Operator Root CA certificate is retained or deleted, after the installation of the new Operator certificate trust chain into BTS. If it is set t |
| **`certhId`** | `MRBTS/MNL/CERTH` | Certification handler identifier | - | 1...1, step 1 | This parameter identifies the certificate handler configuration. The value is always 1. |
| **`actCertValidation`** | `MRBTS/MNL/CERTH/CMP` | Activate certificate validation | - | 0 (false), 1 (true) | This parameter enables / disables certificate validation. |
| **`btsNumberOfSAN`** | `MRBTS/MNL/CERTH/CMP` | BTS number of SANs | - | 0...8, step 1 | This parameter defines the number of dynamic SANs (Subject Alternative Name) certificates configuration. Note : value 0 means that the dynamic SANs certificates function is disabled. |
| **`caCertificateUpdateTime`** | `MRBTS/MNL/CERTH/CMP` | Update time for CA certificate renewal | 90 | 1...4999, step 1 days | This parameter is the number of days in advance to when a BTS own trust anchor certificate or any of the peer trust anchor certificates expires or is due to expire, that the BTS shall raise an alarm. |
| **`caSubjectName`** | `MRBTS/MNL/CERTH/CMP` | CMP server subject name | - | 1...128 characters | This parameter is the subject name of the CMP server. It may either be detected by DHCP upon auto-connection or configured by the management system. |
| **`cmpId`** | `MRBTS/MNL/CERTH/CMP` | Certificate management protocol identifier | 1 | 1...1, step 1 | This parameter is the instance identifier of the Certificate Management protocol object (CMP). It contains CMP server information necessary to perform Automatic Certificate. Enrollment using the CMP p |
| **`cmpPollingTimeout`** | `MRBTS/MNL/CERTH/CMP` | CMP request timeout | 3600 | 60...21600, step 1 seconds | This is the maximum time in seconds the BTS will wait for a CMP Polling cycle before timeout. |
| **`eeSubjectAltNames`** | `MRBTS/MNL/CERTH/CMP` | Domain or IP address of alternative BTS identities in Subject Alternative Name | - | - | This parameter defines domain or IP address of Subject Alternative Names to be added in BTS EE operator certificate.  NOTE:IP address can be both IPV4 or IPV6 |
| **`subjectAltName`** | `MRBTS/MNL/CERTH/CMP` | Subject Alternative name defined as Domain or IP address | - | 1...128 characters | This parameter identifies the subject alternative name to be embedded to the EE certificate (RFC 5280 standard). It could be a DNS name or an IP address.  Note (1): IP Address can be either IPV4 or IP |
| **`subjectAltType`** | `MRBTS/MNL/CERTH/CMP` | Domain or IP address of Subject Alt type | 2 | 1:IP Address;
2:DOMAIN | This parameter defines type of Subject Alternative Names to be added in BTS EE operator certificate.  NOTE:IP address can be both V4 and V6 valid formats. |
| **`eeSubjectName`** | `MRBTS/MNL/CERTH/CMP` | End Entity Subject Name | - | 1...128 characters | This parameter is the subject name to be used in the end entity operator certificate. It is configured by the management system to be used during CMP initialization.  Note: When a given Common Name st |
| **`keyLength`** | `MRBTS/MNL/CERTH/CMP` | Key length | 1 | 1:2048;
2:4096 | This parameter configures RSA key length for key pair generation (2048 bits or 4096 bits). |
| **`neCertUpdateTimeSchedule`** | `MRBTS/MNL/CERTH/CMP` | Update time of the day for NE certificate renewal | 00:00 | 5...5 characters | This parameter defines the time at which Automatic Key Update Request will be triggered in advance number of days (neCertificateUpdateTime) prior to BTS certificate expiry.  NOTE: The time of the day  |
| **`neCertificateUpdateTime`** | `MRBTS/MNL/CERTH/CMP` | Update time for NE certificate renewal | 30 | 1...4999, step 1 days | This parameter is the number of days prior to a BTS certificate expiry, when the BTS autonomously triggers a CMP update sequence. |
| **`secondaryCaSubjectName`** | `MRBTS/MNL/CERTH/CMP` | Secondary CMP server subject name | - | 1...128 characters | This parameter identifies the Secondary CMP server by its subject name. It may either be detected by DHCP upon auto-connection or configured by the management system. |
| **`secondaryServerHost`** | `MRBTS/MNL/CERTH/CMP` | Secondary CMP server IP address or FQDN | - | 2...253 characters | This is the IP address or FQDN (Fully Qualified Domain Name) of the Secondary Certificate Management Protocol server. The IPv4 is in the dotted decimal format. The IPv6 is in the format defined in RFC |
| **`secondaryServerPath`** | `MRBTS/MNL/CERTH/CMP` | Secondary CMP directory | pkix | 1...32 characters | This is the operator-configured Secondary CMP Directory to be used for addressing the Certificate Management Protocol server. |
| **`secondaryServerPort`** | `MRBTS/MNL/CERTH/CMP` | Secondary CMP server port  number | - | 1...65535, step 1 | This is the port number to be used for addressing the Secondary Certificate Management Protocol server. |
| **`serverHost`** | `MRBTS/MNL/CERTH/CMP` | CMP server IP address or FQDN | - | 2...253 characters | This parameter is the IP address or FQDN (Fully Qualified Domain Name) of the Certificate Management Protocol server. The IPv4 is in the dotted decimal format. The IPv6 is in the format defined in RFC |
| **`serverPath`** | `MRBTS/MNL/CERTH/CMP` | CMP directory | pkix | 1...32 characters | This parameter is the operator-configured CMP Directory to be used for addressing the Certificate Management Protocol server. The complete URL for accessing CA Server is: http://<serverHost>:<serverPo |
| **`serverPort`** | `MRBTS/MNL/CERTH/CMP` | CMP server port number | 1024 | 1...65535, step 1 | This parameter is the port number to be used for addressing the Certificate Management Protocol server. |
| **`serverType`** | `MRBTS/MNL/CERTH/CMP` | CMP server type | - | 0:RSA | This parameter defines the type of the CMP (RA/CA) server . - Value 'RSA' means RSA server; |
| **`actCertValidation`** | `MRBTS/MNL/CERTH/CMPECDSA` | Activate certificate validation | - | 0 (false), 1 (true) | This parameter enables / disables certificate validation. |
| **`btsNumberOfSAN`** | `MRBTS/MNL/CERTH/CMPECDSA` | BTS number of SANs | - | 0...8, step 1 | This parameter defines the number of dynamic SANs (Subject Alternative Name) certificates configuration. Note : value 0 means that the dynamic SANs certificates function is disabled. |
| **`caCertificateUpdateTime`** | `MRBTS/MNL/CERTH/CMPECDSA` | Update time for CA certificate renewal | 90 | 1...4999, step 1 days | This parameter is the number of days in advance to when a BTS own trust anchor certificate or any of the peer trust anchor certificates expires or is due to expire, that the BTS shall raise an alarm. |
| **`caSubjectName`** | `MRBTS/MNL/CERTH/CMPECDSA` | CMP server subject name | - | 1...128 characters | This parameter is the subject name of the ECDSA CMP server. It may either be detected by DHCP upon auto-connection or configured by the management system. |
| **`cmpEcdsaId`** | `MRBTS/MNL/CERTH/CMPECDSA` | Certificate management protocol identifier for ECDSA | - | 1...1, step 1 | This parameter is the instance identifier of the Certificate Management protocol object (CMPECDSA). It contains ECDSA CMP server information necessary to perform Automatic Certificate Enrollment using |
| **`cmpPollingTimeout`** | `MRBTS/MNL/CERTH/CMPECDSA` | CMP request timeout | 3600 | 60...21600, step 1 seconds | This is the maximum time in seconds the BTS will wait for a CMP Polling cycle before timeout. |
| **`eeSubjectAltNames`** | `MRBTS/MNL/CERTH/CMPECDSA` | Domain or IP address of alternative BTS identities in Subject Alternative Name | - | - | This parameter defines domain or IP address of Subject Alternative Names to be added in BTS EE operator certificate.   NOTE:IP address can be both IPV4 or IPV6 |
| **`subjectAltName`** | `MRBTS/MNL/CERTH/CMPECDSA` | Subject Alternative name defined as Domain or IP address | - | 1...128 characters | This parameter identifies the subject alternative name to be embedded to the EE certificate (RFC 5280 standard). It could be a DNS name or an IP address.  Note (1): IP Address can be either IPV4 or IP |
| **`subjectAltType`** | `MRBTS/MNL/CERTH/CMPECDSA` | Domain or IP address of Subject Alt type | 2 | 1:IP Address;
2:DOMAIN | This parameter defines type of Subject Alternative Names to be added in BTS EE operator certificate.  NOTE:IP address can be both V4 and V6 valid formats. |
| **`eeSubjectName`** | `MRBTS/MNL/CERTH/CMPECDSA` | End Entity Subject Name | - | 1...128 characters | This parameter is the subject name to be used in the end entity operator certificate. It is configured by the management system to be used during CMP initialization.  Note: When a given Common Name st |
| **`keyLength`** | `MRBTS/MNL/CERTH/CMPECDSA` | Key length | 1 | 1:256;
2:384 | This parameter configures ECDSA key length for EC key pair generation (256 bits or 384 bits). |
| **`neCertUpdateTimeSchedule`** | `MRBTS/MNL/CERTH/CMPECDSA` | Update time of the day for NE certificate renewal | 00:00 | 5...5 characters | This parameter defines the time at which Automatic Key Update Request will be triggered in advance number of days (neCertificateUpdateTime) prior to BTS certificate expiry.  NOTE: The time of the day  |
| **`neCertificateUpdateTime`** | `MRBTS/MNL/CERTH/CMPECDSA` | Update time for NE certificate renewal | 30 | 1...4999, step 1 days | This parameter is the number of days prior to a BTS certificate expiry, when the BTS autonomously triggers a CMP update sequence. |
| **`secondaryCaSubjectName`** | `MRBTS/MNL/CERTH/CMPECDSA` | Secondary CMP server subject name | - | 1...128 characters | This parameter identifies the Secondary ECDSA CMP server by its subject name. It may either be detected by DHCP upon auto-connection or configured by the management system. |
| **`secondaryServerHost`** | `MRBTS/MNL/CERTH/CMPECDSA` | Secondary CMP server IP address or FQDN | - | 2...253 characters | This is the IP address or FQDN (Fully Qualified Domain Name) of the Secondary ECDSA Certificate Management Protocol server. The IPv4 is in the dotted decimal format. The IPv6 is in the format defined  |
| **`secondaryServerPath`** | `MRBTS/MNL/CERTH/CMPECDSA` | Secondary CMP directory | pkix | 1...32 characters | This is the operator-configured Secondary CMP Directory to be used for addressing the Certificate Management Protocol server for ECDSA |
| **`secondaryServerPort`** | `MRBTS/MNL/CERTH/CMPECDSA` | Secondary CMP server port number | - | 1...65535, step 1 | This is the port number to be used for addressing the Secondary Certificate Management Protocol server for ECDSA. |
| **`serverHost`** | `MRBTS/MNL/CERTH/CMPECDSA` | CMP server IP address or FQDN | - | 2...253 characters | This parameter is the IP address or FQDN (Fully Qualified Domain Name) of the Certificate Management Protocol server for ECDSA. The IPv4 is in the dotted decimal format. The IPv6 is in the format defi |
| **`serverPath`** | `MRBTS/MNL/CERTH/CMPECDSA` | CMP directory | pkix | 1...32 characters | This parameter is the operator-configured CMP Directory to be used for addressing the Certificate Management Protocol server for ECDSA. The complete URL for accessing CA Server is: http://<serverHost> |
| **`serverPort`** | `MRBTS/MNL/CERTH/CMPECDSA` | CMP server port number | 1024 | 1...65535, step 1 | This parameter is the port number to be used for addressing the Certificate Management Protocol server for ECDSA. |
| **`serverType`** | `MRBTS/MNL/CERTH/CMPECDSA` | CMP server type | 1 | 1:ECDSA | This parameter defines the (RA/CA) server type: - Value 'ECDSA' means ECDSA server. |
| **`caCertificateUpdateTime`** | `MRBTS/MNL/CERTH/CMPFH` | Update time for CA certificate renewal | 90 | 1...4999, step 1 days | This parameter is the number of days in advance to when a BTS own trust anchor certificate or any of the peer trust anchor certificates expires or is due to expire, that the BTS shall raise an alarm. |
| **`cmpFhId`** | `MRBTS/MNL/CERTH/CMPFH` | Certificate management protocol for fronthaul instance identifier | - | 1...1, step 1 | This parameter uniquely identifies the instance of the Certificate Management Protocol object for Fronthaul (CMPFH) within the same containing MNL/CERTH object instance. |
| **`eeSubjectAltNames`** | `MRBTS/MNL/CERTH/CMPFH` | Domain or IP address of alternative BTS identities in Subject Alternative Name | - | - | This parameter defines domain or IP address of Subject Alternative Names to be added in BTS EE operator certificate.  NOTE:IP address can be both IPV4 or IPV6 |
| **`subjectAltName`** | `MRBTS/MNL/CERTH/CMPFH` | Subject Alternative name defined as Domain, RFC822Name or IP address | - | 1...128 characters | This parameter identifies the subject alternative name to be embedded to the EE certificate. It could be a DNS name, RFC822Name or an IP address.  NOTE: IP Address can be either IPV4 or IPV6 |
| **`subjectAltType`** | `MRBTS/MNL/CERTH/CMPFH` | Domain or IP address, RFC822Name of Subject Alt type | 2 | 1:IP Address;
2:DOMAIN;
3:RFC822Name | This parameter defines the type of Subject Alternative Names to be added in BTS EE operator certificate.  NOTE: IP address can be both V4 and V6 valid formats. |
| **`eeSubjectName`** | `MRBTS/MNL/CERTH/CMPFH` | End Entity Subject Name | - | 1...128 characters | This parameter is the subject name to be used in the end entity operator certificate. It is configured by the management system to be used during CMP initialization. |
| **`keyLength`** | `MRBTS/MNL/CERTH/CMPFH` | Key length | 1 | 1:2048;
2:4096 | This parameter configures the RSA key length for key pair generation. |
| **`neCertificateUpdateTime`** | `MRBTS/MNL/CERTH/CMPFH` | Update time for NE certificate renewal | 30 | 1...4999, step 1 days | This parameter is the number of days in advance to when a BTS operator certificate expires or is due to expire, that the BTS shall raise an alarm |
| **`cmpFhExtId`** | `MRBTS/MNL/CERTH/CMPFHEXT` | Certificate management protocol extended for fonthaul instance identifier | 1 | 1...1, step 1 | This parameter uniquely identifies the instance of the Certificate Management Protocol Extended object for Fronthaul (CMPFHEXT) within the same containing MNL/CERTH object instance. |
| **`extKeyUsageTlsClientAuth`** | `MRBTS/MNL/CERTH/CMPFHEXT` | Extended key usage for TLS client authentication | - | 0 (false), 1 (true) | This parameter specifies whether the extended key usage is used for TLS client authentication. |
| **`extKeyUsageTlsServerAuth`** | `MRBTS/MNL/CERTH/CMPFHEXT` | Extended key usage for TLS server authentication | - | 0 (false), 1 (true) | This parameter specifies whether the extended key is used for TLS server (O-RU) authentication. |
| **`crlDownloadProtocol`** | `MRBTS/MNL/CERTH/CRLH` | CRL Download Protocol | - | 0:LDAP;
1:LDAP_OR_HTTP | This parameter indicates the protocol(s) supported by BTS to obtain a Certificate Revocation List (CRL) from Certificate Revocation Distribution Point (CRLDP). LDAP : it means BTS is able to download  |
| **`crlhId`** | `MRBTS/MNL/CERTH/CRLH` | Certificate revocation list handling identifier | - | 1...1, step 1 | This parameter is the instance identifier of the Certificate Revocation List Handling object (CRLH). |
| **`distributionPointSource`** | `MRBTS/MNL/CERTH/CRLH` | CRL distribution point source | - | 0:Certificate_extension;
1:Configuration_parameter;
2:Extension_and_parameter | This parameter indicates the source of a CRL Distribution Point. This can be manually-configured CRLDP or CRLDP contained in a certificate extension. |
| **`updatePeriod`** | `MRBTS/MNL/CERTH/CRLH` | CRL update period | 24 | 0...8760, step 1 hours | This parameter is the periodic interval in which a CRL should be updated. The value is given in hours. Value 0 means "no periodical update". |
| **`usageEnabled`** | `MRBTS/MNL/CERTH/CRLH` | CRL usage enabled | 1 | 0:Disabled;
1:Enabled | This parameter indicates whether CRL should be used. A peer certificate is validated using the downloaded CRL during IPSec or TLS negotiation. |
| **`crldpconfigId`** | `MRBTS/MNL/CERTH/CRLH/CRLDPCONFIG` | CRL distribution point configuration identifier | - | 1...68, step 1 | This parameter is the instance identifier of the Certificate Revocation List Distribution Point Configuration object (CRLDPCONFIG). This object can contain both Primary and Secondary CRL distribution  |
| **`primaryCRLDP`** | `MRBTS/MNL/CERTH/CRLH/CRLDPCONFIG` | Primary CRL distribution point URI | - | 1...256 characters | This parameter is the LDAP or HTTP URI of the operator-defined primary CRL distribution point. It must be unique among all the primary CRLDP and secondary CRLDP configured in the BTS. Note: only chara |
| **`secondaryCRLDP`** | `MRBTS/MNL/CERTH/CRLH/CRLDPCONFIG` | Secondary CRL distribution point URI | - | 1...256 characters | This parameter is the LDAP or HTTP URI of the operator-defined secondary CRL distribution point. It must be unique among all the primary CRLDP and secondary CRLDP configured in the BTS. Note: only cha |
| **`cmdId`** | `MRBTS/MNL/CMD` | CMD instance identifier | - | 1...1, step 1 | This parameter uniquely identifies the commands instance class. There is only one instance of class CMD. |
| **`cellsCalculationReqId`** | `MRBTS/MNL/CMD/CELLSCALCULATIONREQ` | Cell re-calculation instance identifier | - | 1...255, step 1 | This parameter uniquely identifies the cell re-calculation command. Sending this command to BTS triggers re-calculation of all cells of the BTS impacted with the fault 4715 "BTS cell re-calculation re |
| **`cellsRecalculationComment`** | `MRBTS/MNL/CMD/CELLSCALCULATIONREQ` | Cells re-calculation command comment | - | 0...2048 characters | A comment to the cells re-calculation command. |
| **`cellsCalculationResId`** | `MRBTS/MNL/CMD/CELLSCALCULATIONREQ/CELLSCALCULATIONRES` | Cell re-calculation instance identifier | - | 1...1, step 1 | This parameter uniquely identifies the cell re-calculation result instance. |
| **`cellsRecalculationComment`** | `MRBTS/MNL/CMD/CELLSCALCULATIONREQ/CELLSCALCULATIONRES` | Cells re-calculation command comment | - | 1...2048 characters | When the BTS executes the cells calculation command, it will copy the value from the cellsRecalculationComment parameter of the parent CELLSCALCULATIONREQ instance into this parameter. |
| **`cellsRecalculationResult`** | `MRBTS/MNL/CMD/CELLSCALCULATIONREQ/CELLSCALCULATIONRES` | Cells re-calculation result | - | 0:success;
1:failure | The parameter defines the result of the cell re-calculation command. |
| **`combinedResetReqId`** | `MRBTS/MNL/CMD/COMBINEDRESETREQ` | COMBINEDRESETREQ instance identifier | - | 0...1, step 1 | Identifier of the combined reset request command that is used for combined software and configuration activation |
| **`keepLatestConfig`** | `MRBTS/MNL/CMD/COMBINEDRESETREQ` | Keep latest configuration | - | 0 (false), 1 (true) | This parameter specifies whether to keep latest active BTS configuration within the scope supported by the target SW in a combined software and configuration activation procedure.  if the parameter is |
| **`targetPlanId`** | `MRBTS/MNL/CMD/COMBINEDRESETREQ` | Target configuration plan identifier | - | 1...2048 characters | This parameter defines the plan ID (e.g. 3815544281) that is used in the combined software and configuration activation. When both target software and configuration are available in the BTS passive pa |
| **`targetSwVersionId`** | `MRBTS/MNL/CMD/COMBINEDRESETREQ` | Target software package version identifier | - | 1...2048 characters | This parameter defines the software package ID (e.g. SBTS20B_ENB_0000_000229_000000) that is used in the combined software and configuration activation.  If keeping latest configuration is not request |
| **`combinedResetResId`** | `MRBTS/MNL/CMD/COMBINEDRESETREQ/COMBINEDRESETRES` | COMBINEDRESETRES instance identifier | - | 1...1, step 1 | Identifier of the combined reset command respond object. The object is created in the source configuration. |
| **`combinedResetResult`** | `MRBTS/MNL/CMD/COMBINEDRESETREQ/COMBINEDRESETRES` | Combined reset result | - | 0:success;
1:failure | This parameter defines the result of the combined software and configuration activation. The value is "success" when the software activation is performed successfully and the BTS restarts with the new |
| **`copySWToPassiveReqId`** | `MRBTS/MNL/CMD/COPYSWTOPASSIVEREQ` | COPYSWTOPASSIVEREQ instance id | - | 1...1, step 1 | The identifier of a Copy SW To Passive Request instance. |
| **`copyToPassive`** | `MRBTS/MNL/CMD/COPYSWTOPASSIVEREQ` | Copy SW and config to passive partition command | - | 0:SW and config without health check;
1:SW and config with health check | This operation allows copying SW and configuration from an active to a passive partition. Any SW or configuration on a passive filesystem will be overwritten. The operator shall use this command with  |
| **`copyToPassiveComment`** | `MRBTS/MNL/CMD/COPYSWTOPASSIVEREQ` | Copy SW and config to passive partition command comment | - | 0...2048 characters | A comment to a copy SW and config to passive partition command. |
| **`copySWToPassiveResId`** | `MRBTS/MNL/CMD/COPYSWTOPASSIVEREQ/COPYSWTOPASSIVERES` | COPYSWTOPASSIVERES instance identifier | - | 1...1, step 1 | The identifier of a Copy SW To Passive Result Instance. |
| **`result`** | `MRBTS/MNL/CMD/COPYSWTOPASSIVEREQ/COPYSWTOPASSIVERES` | Copy SW and config to passive partition result | - | 0:success;
1:failure | The parameter defines the result of copy SW and config to passive partition command. |
| **`gracefulCellShutdown`** | `MRBTS/MNL/CMD/HWRESETREQ` | Graceful Cell Shutdown | - | 0 (false), 1 (true) | Value defines if impacted working cells are shut down gracefully before the reset, allowing handover of ongoing calls. |
| **`hwResetComment`** | `MRBTS/MNL/CMD/HWRESETREQ` | Hardware reset command comment | - | 0...2048 characters | Whenever a plan modifying this parameter is activated, the BTS will perform a reset for the target unit (HWRESETREQ.targetHwResetUDN). The value of this parameter as such is not relevant. However, at  |
| **`hwResetReqId`** | `MRBTS/MNL/CMD/HWRESETREQ` | HWRESETREQ instance identifier | - | 1...65535, step 1 | The identifier of the hardware reset command. |
| **`powerReset`** | `MRBTS/MNL/CMD/HWRESETREQ` | Power reset | - | 0 (false), 1 (true) | Power reset type for BBMOD.  If this parameter is set to TRUE, power reset will be triggered for the selected BBMOD. If this parameter is set to FALSE or is not set, regular (warm) reset will be trigg |
| **`targetHwResetUDN`** | `MRBTS/MNL/CMD/HWRESETREQ` | Target HW reset unit distinguish name | - | 1...400 characters | The target Distinguished Name of the HW Unit to be reset.  Following rules are valid for all variant of cards - air cooled (ABIx) and liquid cooled (ABIxL): If the target HW unit is a radio module and |
| **`hwResetComment`** | `MRBTS/MNL/CMD/HWRESETREQ/HWRESETRES` | Hardware reset request | - | 0...2048 characters | When the BTS executes the hardware reset command, it will copy the value from the hwResetComment parameter of the parent HWRESETREQ instance into this parameter. When the value of this parameter is th |
| **`hwResetResId`** | `MRBTS/MNL/CMD/HWRESETREQ/HWRESETRES` | RESETRES instance identifier | - | 1...1, step 1 | The identifier of the hardware reset result instance. |
| **`hwResetResult`** | `MRBTS/MNL/CMD/HWRESETREQ/HWRESETRES` | HW reset result | - | 0:success;
1:failure | The parameter defines the result of the hardware reset command. |
| **`powerReset`** | `MRBTS/MNL/CMD/HWRESETREQ/HWRESETRES` | Power reset | - | 0 (false), 1 (true) | This parameter indicates whether a power reset was triggered for BBMOD. |
| **`l2PoolDistrReqId`** | `MRBTS/MNL/CMD/L2POOLDISTRREQ` | L2 pool distribution request Id | - | 1...1, step 1 | The parameter is used for requesting activation of L2 pool distribution in a VNF. |
| **`l2PoolDistrResId`** | `MRBTS/MNL/CMD/L2POOLDISTRREQ/L2POOLDISTRRES` | L2 pool distribution response Id | - | 1...1, step 1 | The parameter is used by a VNF when replying to a request of L2 pool distribution activation in a VNF. |
| **`l2PoolDistrResult`** | `MRBTS/MNL/CMD/L2POOLDISTRREQ/L2POOLDISTRRES` | L2 pool distribution result | - | 1:succeed;
2:failed;
3:rejected | The parameter is used to inform the operator about the result of L2 pool distribution in a VNF. |
| **`localUserAllowedIdlePerUpdate`** | `MRBTS/MNL/CMD/LUACREQ` | Local user allowed idle period update | - | 0:Inactivity_Period_Update | This command requests an update of the BTS Security Administrator, the BTS Application Administrator and the BTS Read Only user accounts idle period by the number of days configured in the parameter ' |
| **`localUserAllowedLifetimeUpdate`** | `MRBTS/MNL/CMD/LUACREQ` | Local user allowed lifetime update | - | 0:Lifetime_Update | This command requests an update of the BTS Security Administrator, the BTS Application Administrator and the BTS Read Only user accounts lifetime by the number of days configured in the parameter 'loc |
| **`luacReqId`** | `MRBTS/MNL/CMD/LUACREQ` | LUAC request instance identifier | - | 1...1, step 1 | This parameter uniquely identifies the instance of LUACREQ object. |
| **`sysAdmAllowedIdlePerUpdate`** | `MRBTS/MNL/CMD/LUACREQ` | System administrator allowed idle period update | - | 0:Inactivity_Period_Update | This command requests an update of the BTS system administrator account idle period by the number of days configured in the parameter 'sysAdmAllowedIdlePeriod'. |
| **`sysAdmAllowedLifetimeUpdate`** | `MRBTS/MNL/CMD/LUACREQ` | System administrator allowed lifetime update | - | 0:Lifetime_Update | This command requests an update of the BTS system administrator account lifetime by the number of days configured in the parameter 'sysAdmAllowedLifetime'. |
| **`localUserAllowedIdlePerResult`** | `MRBTS/MNL/CMD/LUACREQ/LUACRES` | Local user allowed idle period result | - | 0:success;
1:failure;
2:ignored | The parameter defines the result of the BTS Security Administrator, the BTS Application Administrator and the BTS Read Only users accounts idle period update command. |
| **`localUserAllowedLifetimeResult`** | `MRBTS/MNL/CMD/LUACREQ/LUACRES` | Local user allowed lifetime result | - | 0:success;
1:failure;
2:ignored | The parameter defines the result of the BTS Security Administrator, the BTS Application Administrator and the BTS Read Only accounts lifetime update command. |
| **`luacResId`** | `MRBTS/MNL/CMD/LUACREQ/LUACRES` | LUAC result instance identifier | - | 1...1, step 1 | This parameter uniquely identifies the instance of LUACRES object. |
| **`sysAdmAllowedIdlePerResult`** | `MRBTS/MNL/CMD/LUACREQ/LUACRES` | System administrator allowed idle period result | - | 0:success;
1:failure;
2:ignored | The parameter defines the result of the BTS system administrator accounts idle period update command. |
| **`sysAdmAllowedLifetimeResult`** | `MRBTS/MNL/CMD/LUACREQ/LUACRES` | System administrator allowed lifetime result | - | 0:success;
1:failure;
2:ignored | The parameter defines the result of the BTS system administrator account lifetime update command. |
| **`prtclchgReqId`** | `MRBTS/MNL/CMD/PRTCLCHGREQ` | PRTCLCHGREQ instance identifier | - | 1...256, step 1 | Identifier of the Protocol Change Request Instance. |
| **`rModUpgrade`** | `MRBTS/MNL/CMD/PRTCLCHGREQ` | Radio modules upgrade | - | - | This structure is used to configure the set of radio modules that should be upgraded to a different protocol. It is used for radio modules which support both CPRI and eCPRI protocols. |
| **`iqCompression`** | `MRBTS/MNL/CMD/PRTCLCHGREQ` | IQ Compression | - | 0:none;
9:CPRI 9bits;
10:CPRI 10bits;
97:eCPRI 9bits | This parameter defines IQ Compression used in links between the system/baseband modules and the radio module. It should be set only for CPRI and eCPRI links.  - 'none' means IQ Compression function is |
| **`linkSpeed`** | `MRBTS/MNL/CMD/PRTCLCHGREQ` | Link speed | - | 7:Cpri7;
100:eCpri10;
125:eCpri25 | This parameter defines speed between the system baseband module and the radio module. It should be set only for CPRI and eCPRI links.  Speed limitation is based on the modules and SFP hardware variant |
| **`rModDN`** | `MRBTS/MNL/CMD/PRTCLCHGREQ` | Radio module distinguished name | - | 1...400 characters | This parameter defines the distinguished name of the instance representing a radio module to be upgraded to a different protocol. This instance must be of the RMOD MOC.  In SRAN and 5G some radio modu |
| **`radioProtocolType`** | `MRBTS/MNL/CMD/PRTCLCHGREQ` | Radio protocol type | - | 1:25eCPRI;
2:10eCPRI;
3:TDDCPRI;
5:eCPRI;
6:CPRI | This parameter defines requested new radio protocol type to be used on the CABLINK. In case of wrong value configuration radio units will not be upgraded. This parameter must have correct value for al |
| **`prtclChgResId`** | `MRBTS/MNL/CMD/PRTCLCHGREQ/PRTCLCHGRES` | PRTCLCHGRES instance identifier | - | 1...1, step 1 | The identifier of the protocol change result instance. |
| **`prtclChgResult`** | `MRBTS/MNL/CMD/PRTCLCHGREQ/PRTCLCHGRES` | Protocol change result | - | 0:success;
1:failure | The parameter defines the result of the protocol change request command. |
| **`retUCalReqId`** | `MRBTS/MNL/CMD/RETUCALREQ` | RET Unit calibration request object identifier | - | 1...2048, step 1 | The identifier of the RET Unit Calibration Request Instance. |
| **`targetRetUDN`** | `MRBTS/MNL/CMD/RETUCALREQ` | Target RET unit distinguish name | - | 1...400 characters | This parameter defines the reference to the RET module to which the calibration Request shall be applied.  Distinguished name can be either Fully Distinguished Name (FDN) or shortened one as long as i |
| **`result`** | `MRBTS/MNL/CMD/RETUCALREQ/RETUCALRES` | RET Unit calibration result | - | 0:success;
1:failure | The parameter defines the result of the RET Unit Calibration Command. |
| **`retUCalResId`** | `MRBTS/MNL/CMD/RETUCALREQ/RETUCALRES` | RETUCALRES instance identifier | - | 1...1, step 1 | The identifier of the RET Unit Calibration Result Instance. |
| **`retUConFileApplyReqId`** | `MRBTS/MNL/CMD/RETUCONFILEAPPLYREQ` | RETUCONFILEAPPLYREQ instance identifier | - | 1...2048, step 1 | The identifier of the RET Unit Configuration File Apply Request Instance. |
| **`targetRetUDN`** | `MRBTS/MNL/CMD/RETUCONFILEAPPLYREQ` | Target RET unit distinguish name | - | 1...400 characters | This parameter defines the reference to the RET module to which the file apply request shall be performed.  Distinguished name can be either Fully Distinguished Name (FDN) or shortened one as long as  |
| **`result`** | `MRBTS/MNL/CMD/RETUCONFILEAPPLYREQ/RETUCONFILEAPPLYRES` | RET unit configuration file apply result | - | 0:success;
1:failure | The parameter defines the result of the RET Unit Configuration File Apply Command. |
| **`retUConFileApplyResId`** | `MRBTS/MNL/CMD/RETUCONFILEAPPLYREQ/RETUCONFILEAPPLYRES` | RETUCONFILEAPPLYRES instance identifier | - | 1...2048, step 1 | The identifier of the RET Unit Calibration Result Instance. |
| **`gracefulCellShutdown`** | `MRBTS/MNL/CMD/SWRESETREQ` | Graceful Cell Shutdown | - | 0 (false), 1 (true) | Value defines if impacted working cells are shut down gracefully before the reset, allowing handover of ongoing calls. |
| **`swResetComment`** | `MRBTS/MNL/CMD/SWRESETREQ` | Software reset command comment | - | 0...2048 characters | A comment to the software reset command. |
| **`swResetLevel`** | `MRBTS/MNL/CMD/SWRESETREQ` | Software reset command level | - | 0:btsReset;
1:lteReset;
2:gsmReset;
3:wcdmaReset;
4:resetToTestLevel;
5:gnbReset;
7:powerReset;
8:snapAndPowerReset;
9:lteHardReset;
10:gnbHardReset;
11:btsResetWithoutRuReset | Value defines of the software reset level. Can be chosen: btsReset, lteReset, gsmReset, wcdmaReset, gnbReset, resetToTestLevel, powerReset, snapAndPowerReset, lteHardReset, gnbHardReset and btsResetWi |
| **`swResetReqId`** | `MRBTS/MNL/CMD/SWRESETREQ` | SWRESETREQ instance identifier | - | 1...255, step 1 | The identifier of the software reset command. |
| **`swResetResId`** | `MRBTS/MNL/CMD/SWRESETREQ/SWRESETRES` | SWRESETRES instance identifier | - | 1...1, step 1 | The identifier of the software reset result instance. |
| **`swResetResult`** | `MRBTS/MNL/CMD/SWRESETREQ/SWRESETRES` | Software reset result | - | 0:success;
1:failure | The parameter defines the result of the software reset command. |
| **`cpriSyncBreakTime`** | `MRBTS/MNL/MNLENT` | CPRI sync break time | 200 | 100...10000, step 100 ms | This parameter specifies the time period of synchronization break to the Radio Unit caused by CPRI link interruption. In case of the synchronization break is longer than cpriSyncBreakTime, the Radio U |
| **`fipsPeriodicSelfTestSchedule`** | `MRBTS/MNL/MNLENT` | FIPS self-test periodic scheduler | - | 5...5 characters | This parameter defines the time at which the periodic self-test will be triggered every day.  Note:  - The time of the day is in 24:00 Hour format as per local time zone. The value set for this parame |
| **`fipsStartupSelfTestEnable`** | `MRBTS/MNL/MNLENT` | FIPS self test at startup and restart enable | - | 0 (false), 1 (true) | This parameter enables the running of crypto module self-test during startup and restart.  Note: This parameter shall not be used for ORAN deployment. |
| **`mnlEntId`** | `MRBTS/MNL/MNLENT` | MNL entity instance identifier | - | 1...1, step 1 | This parameter identifies the management layer entity class. |
| **`recoveryResetDelay`** | `MRBTS/MNL/MNLENT` | Recovery reset delay | - | 0...1200, step 1 sec | Defines the minimal number of seconds after which a recovery reset can be triggered. Note: When setting the parameter value to 10000 (unlimited delay), the recovery reset will be performed after all s |
| **`stickToSyncSourcePeriod`** | `MRBTS/MNL/MNLENT` | Stick to synchronization source period | 50 | 0...9900, step 10 ms | Stick to synchronization source period defines a time that radio modules wait after loss of synchronization for synchronization signal being available again on former synchronization link before switc |
| **`targetDN`** | `MRBTS/MNL/MNLENT` | Target  distinguished name | - | 1...400 characters | The Distinguished name of the associated target, defined in targetDNType.This parameter is set only when targetDNType is set to RAP.  Distinguished name can be either Fully Distinguished Name (FDN) or |
| **`targetDNType`** | `MRBTS/MNL/MNLENT` | Target  DN type | - | 0:VM;
1:RAP | This parameter defines the type of the target-associated object. |
| **`bbAdmId`** | `MRBTS/MNL/MNLENT/BBADM` | BBADM  instance identifier | - | 1...1, step 1 | This parameter identifies the baseband administration instance class. There is only one instance of class BBADM. |
| **`bbPoolCellsList`** | `MRBTS/MNL/MNLENT/BBADM/BBPOOL` | List of cells identifiers hosted by the baseband pool | - | 0...268435455, step 1 | This is the list of cells mapped to a given baseband pool. The cell identifier is used as the representation when a given cell is added to the cells list. |
| **`bbPoolId`** | `MRBTS/MNL/MNLENT/BBADM/BBPOOL` | BBPOOL instance identifier | - | 1...255, step 1 | This is the instance identifier of the BBPOOL object. |
| **`bbPoolTech`** | `MRBTS/MNL/MNLENT/BBADM/BBPOOL` | Baseband pool technology | - | 1:LTE;
2:WCDMA;
3:GSM;
5:TETRA;
6:5G | This parameter defines the technology of the baseband pool. Values: LTE, WCDMA, GSM, TETRA, 5G. |
| **`bbPwrGroupDNList`** | `MRBTS/MNL/MNLENT/BBADM/BBPOOL` | List of Power Groups identifiers being hosts for baseband pool | - | 1...400 characters | List of POWERGROUPs that are used as hosts for a given baseband pool. For a baseband pool being hosted by one POWERGROUP, the list contains one POWERGROUP.powerGroupId instance. For a baseband pool be |
| **`operationalState`** | `MRBTS/MNL/MNLENT/BBADM/BBPOOL` | Operational state | - | 0:disabled;
1:enabled | This parameter holds the operational state of the baseband pool associations object.  The operational state is set to enabled if the BBPOOL object is established and no error conditions exist for the  |
| **`resourceDNList`** | `MRBTS/MNL/MNLENT/BBADM/BBPOOL` | Resource Distinguished Name List | - | 1...400 characters | A list of resources (VMs, POWERGROUPs) that are  used as hosts for a given baseband pool. |
| **`capCfgId`** | `MRBTS/MNL/MNLENT/CAPCFG` | CAPCFG instance identifier | - | 1...1, step 1 | This is the instance identifier of the CAPCFG object. CAPCFG is used by the BTS to report to NetAct SWEM the BTS capacity utilization level required for License Management-related operations. |
| **`cellsWithIqcDsApplied`** | `MRBTS/MNL/MNLENT/CAPCFG` | Number of cells applying IQ Compression and/or Down Sampling | - | 0...65535, step 1 | The number of cells in a BTS for which IQ Compression and/or Down Sampling is applied. |
| **`cellsWithOptBbCalcApplied`** | `MRBTS/MNL/MNLENT/CAPCFG` | Number of cells applying optimized Baseband usage | - | 0...65535, step 1 | The number of cells in a BTS to which the optimized Baseband usage is applied. |
| **`enbBbCapacityUsage`** | `MRBTS/MNL/MNLENT/CAPCFG` | Summarized usage of LTE BB capacity in BTS | - | 1...12, step 1 | Summarized utilization of all available baseband  resources (BBPOOL) within an LTE BTS. Baseband capacity utilization is calculated by the BTS summing all available baseband pools that each have at le |
| **`enbHwRelease`** | `MRBTS/MNL/MNLENT/CAPCFG` | LTE BTS HW Release | - | 1...256 characters | Indication what the LTE BTS HW release is. The parameter is set by the BTS system. Required for an LTE License Management operation. |
| **`capLimId`** | `MRBTS/MNL/MNLENT/CAPLIM` | CAPLIM instance identifier | - | 1...1, step 1 | This is the instance identifier of the CAPLIM object. |
| **`ipTrafficCapacityLimitEnabled`** | `MRBTS/MNL/MNLENT/CAPLIM` | IP traffic capacity limit enabled | - | 0 (false), 1 (true) | The parameter defines whether the IP capacity limit mechanism is enabled. |
| **`cellmappingId`** | `MRBTS/MNL/MNLENT/CELLMAPPING` | CELLMAPPING Instance Id | - | 1...1, step 1 | This is the instance identifier of the CELLMAPPING object. |
| **`bandNumber`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELC` | Band Number | - | 1...14, step 1 | This parameter contains the GSM band number. Following mapping is used: 1: T-GSM-380 2: PCS-1900 3: DCS-1800 4: T-GSM-410 5: GSM-850 6: GSM-450 7:  GSM-480 8: E-GSM-900 9: GSM-750 10: T-GSM-810 11: P- |
| **`lCelcId`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELC` | Local cell resource identifier | - | 1...255, step 1 | This is the instance identifier of the GSM local cell resource object (LCELC). A local cell resource consists of the HW required by one cell for transmission and receiving. The local cell resource is  |
| **`channelGroupId`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELC/CHANNELGROUP` | Channel Group identifier | - | 1...36, step 1 | Instance identifier of the object CHANNELGROUP. In case the cell is a  "Super Cell" or "Liquid Cell" the CHANNELGROUP contains the related CHANNEL objects of the subcell, otherwise it contains the CHA |
| **`mainCarrierId`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELC/CHANNELGROUP` | Main carrier id | - | 1...12, step 1 | This parameter will indicate the main carrier id under which all replica carriers are defined for a single logical carrier.  It will increase in sequential order for each logical main carrier.  Note:  |
| **`replicaId`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELC/CHANNELGROUP` | Replica id | - | 1...6, step 1 | This parameter defines the Replica ID for either Lean GSM or CMST feature. In Lean GSM, it should be considered as Beam ID. In Composited Multi Site Transmission (CMST), it should be considered as Nod |
| **`antlDN`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELC/CHANNELGROUP/CHANNEL` | Distinguished Name of antenna line | - | 1...2048 characters | Distinguished name of object ANTL or ASIANTL.  Distinguished name can be either Fully Distinguished Name (FDN) or shortened one as long as it is unambiguous within the network element configuration. E |
| **`channelId`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELC/CHANNELGROUP/CHANNEL` | Channel identifier | - | 1...128, step 1 | Instance identifier of the object CHANNEL. |
| **`direction`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELC/CHANNELGROUP/CHANNEL` | Direction of the channel | - | 1:TX;
2:RX | States the direction of the channel of the related antenna line. |
| **`iqStreamId`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELC/CHANNELGROUP/CHANNEL` | I/Q Data Stream Identifier | - | 0...127, step 1 | For CHANNELGROUP with multiple CHANNEL objects of the same direction (Tx or Rx), this parameter defines I/Q data stream which eNB or gNB shall assign to the CHANNEL. This parameter can be used to swit |
| **`resourceDN`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELC/CHANNELGROUP/CHANNEL` | Distinguished Name of resource | - | 1...2048 characters | Distinguished name of object resource that belongs to this CHANNEL. This parameter is only valid for LTE and 5G cells (LCELL and LCELNR objects).  Distinguished name can be either Fully Distinguished  |
| **`actAsiDistMimo`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELL` | Activate support for ASi distributed DL mimo | - | 0 (false), 1 (true) | This parameter allows the support of the ASi Distributed 4x4 DL Mimo. With the feature enabled, the CHANNELGROUP is allowed to include 8 CHANNELs.   When the feature is disabled, operator is not able  |
| **`actDynamicSharedSpectrum`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELL` | Activate dynamic shared spectrum | - | 0 (false), 1 (true) | This parameter enables dynamic spectrum sharing |
| **`actWcdmaLteSharedSpectrum`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELL` | Activate WCDMA and LTE shared spectrum | - | 0 (false), 1 (true) | This parameter enables WCDMA-LTE spectrum sharing.  Note:If this parameter is set to TRUE, parameters blankedPucch & selectOuterPuschRegion shall not be used by the system. Instead the values are calc |
| **`bbModGroupTarget`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELL` | Target baseband module group | - | 1...6, step 1 | This parameter describes the target group of the baseband modules to which the cell shall be allocated.  Configuration hint: Allocation of manual cell to baseband module is meant for special cases and |
| **`bbmodType`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELL` | Baseband Module Type | - | 1:ABIA_type;
2:ABIO_type;
3:ABIN_type;
4:ABIP_type;
5:ABIQ_type | This parameter describes the type of baseband module to which the LTE cell is allocated. This parameter can be only specified when the LTE cell is supported by radio module (RMOD or ASIRMOD) split bet |
| **`dynamicSharedSpectrumGsmCellDN`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELL` | Dynamic shared spectrum GSM cell distinguished name | - | 1...400 characters | The Distinguished Name of the associated GSM cell used in dynamic shared spectrum.  Distinguished name can be either Fully Distinguished Name (FDN) or shortened one as long as it is unambiguous within |
| **`intShutdownTimeout`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELL` | Intelligent shutdown timeout | - | 0...9999, step 1 min | This parameter denotes timeout for intelligent shutdown in minutes. The value of "0" means that cell is immediately shut down with high priority. If parameter isn't present in LCELL object, it means t |
| **`lCellId`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELL` | Local cell resource identifier | - | 0...255, step 1 | The LTE local cell resource is an object that consists of the HW required by one cell for transmission and receiving. Local cell resource identifier is used to address one particular local cell resour |
| **`protocolType`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELL` | Protocol type | - | 0:CPRI;
1:eCPRI | This parameter defines the fronthaul protocol that shall be used for this cell. |
| **`sharedSpectrumWcdmaCellDN`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELL` | Shared spectrum WCDMA cell distinguished name | - | 0...400 characters | The Distinguished Name of the associated WCDMA cell used in shared spectrum.  Distinguished name can be either Fully Distinguished Name (FDN) or shortened one as long as it is unambiguous within the n |
| **`smodDN`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELL` | System module distinguished name | - | 1...84 characters | This parameter contains the Distinguished Name of the system module the cell shall be allocated to. This parameter is only valid for dual core configuration where Radio Module handling particular LTE  |
| **`vlanId`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELL` | VLAN ID | - | 1...4094, step 1 | This parameter defines the VLAN identifier which shall be used for a LTE cell |
| **`wlSsMinGapDl`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELL` | Min Gap for Shared Spectrum(DL) between WCDMA and LTE cell | - | 0...180, step 1 kHz | wlSsMinGapDl is operator configured Minimum Gap between WCDMA and paired LTE cell for Shared Spectrum in DL (in kHz). When this value is set, it overwrites the system calculated value.   SBTS system c |
| **`wlSsMinGapDlSys`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELL` | Calculated Min Gap between WCDMA and LTE cell for Shared Spectrum(DL) | - | 0...180, step 1 | wlSsMinGapDlSys(in kHz) defines the system calculated minimum space between DL frequencies used by WCDMA cell and paired LTE cell when spectrum sharing WCDMA-LTE is activated for these cells.  This va |
| **`channelGroupId`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELL/CHANNELGROUP` | Channel Group identifier | - | 1...36, step 1 | Instance identifier of the object CHANNELGROUP. In case the cell is a  "Super Cell" or "Liquid Cell" the CHANNELGROUP contains the related CHANNEL objects of the subcell, otherwise it contains the CHA |
| **`mainCarrierId`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELL/CHANNELGROUP` | Main carrier id | - | 1...12, step 1 | This parameter will indicate the main carrier id under which all replica carriers are defined for a single logical carrier.  It will increase in sequential order for each logical main carrier.  Note:  |
| **`replicaId`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELL/CHANNELGROUP` | Replica id | - | 1...6, step 1 | This parameter defines the Replica ID for either Lean GSM or CMST feature. In Lean GSM, it should be considered as Beam ID. In Composited Multi Site Transmission (CMST), it should be considered as Nod |
| **`antlDN`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELL/CHANNELGROUP/CHANNEL` | Distinguished Name of antenna line | - | 1...2048 characters | Distinguished name of object ANTL or ASIANTL.  Distinguished name can be either Fully Distinguished Name (FDN) or shortened one as long as it is unambiguous within the network element configuration. E |
| **`channelId`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELL/CHANNELGROUP/CHANNEL` | Channel identifier | - | 1...128, step 1 | Instance identifier of the object CHANNEL. |
| **`direction`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELL/CHANNELGROUP/CHANNEL` | Direction of the channel | - | 1:TX;
2:RX | States the direction of the channel of the related antenna line. |
| **`iqStreamId`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELL/CHANNELGROUP/CHANNEL` | I/Q Data Stream Identifier | - | 0...127, step 1 | For CHANNELGROUP with multiple CHANNEL objects of the same direction (Tx or Rx), this parameter defines I/Q data stream which eNB or gNB shall assign to the CHANNEL. This parameter can be used to swit |
| **`resourceDN`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELL/CHANNELGROUP/CHANNEL` | Distinguished Name of resource | - | 1...2048 characters | Distinguished name of object resource that belongs to this CHANNEL. This parameter is only valid for LTE and 5G cells (LCELL and LCELNR objects).  Distinguished name can be either Fully Distinguished  |
| **`actAsiDistMimoNr`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELNR` | Activate support for ASi distributed DL mimo for NR FDD | - | 0 (false), 1 (true) | This parameter allows the support of the ASi Distributed 4x4 DL Mimo. With the feature enabled, the CHANNELGROUP is allowed to include 8 CHANNELs.   When the feature is disabled, operator is not able  |
| **`actSimplChConfMAA`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELNR` | Activate simplified MAA NRCELL channel config | - | 0 (false), 1 (true) | This parameter activates/deactivates simplified channel configuration for NR cell mapped to massive MIMO radio unit which has integrated antennas. When the feature is activated, then the direction def |
| **`bbModGroupTarget`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELNR` | Target baseband module group | - | 1...6, step 1 | This parameter describes the target group of the baseband modules to which the cell shall be allocated.  Configuration hint: Allocation of manual cell to baseband module is meant for special cases and |
| **`intShutdownTimeout`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELNR` | Intelligent shutdown timeout | - | 0...9999, step 1 min | This parameter denotes timeout for intelligent shutdown in minutes. The value of "0" means that cell is immediately shut down with high priority. If parameter isn't present in LCELNR object, it means  |
| **`lCelnrId`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELNR` | Local cell resource identifier | - | 0...16383, step 1 | The 5G local cell resource is an object that consists of the HW required by one cell for transmission and receiving. Local cell resource identifier is used to address one particular local cell resourc |
| **`protocolType`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELNR` | Protocol type | - | 0:CPRI;
1:eCPRI | This parameter defines the fronthaul protocol that shall be used for this cell. |
| **`smodDN`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELNR` | System module distinguished name | - | 1...84 characters | This parameter contains the Distinguished Name of the system module the cell shall be allocated to. This parameter is only valid for dual core configuration where Radio Module handling particular NR c |
| **`vlanId`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELNR` | VLAN ID | - | 1...4094, step 1 | This parameter defines the VLAN identifier which shall be used for a NR cell |
| **`channelGroupId`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELNR/CHANNELGROUP` | Channel Group identifier | - | 1...36, step 1 | Instance identifier of the object CHANNELGROUP. In case the cell is a  "Super Cell" or "Liquid Cell" the CHANNELGROUP contains the related CHANNEL objects of the subcell, otherwise it contains the CHA |
| **`mainCarrierId`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELNR/CHANNELGROUP` | Main carrier id | - | 1...12, step 1 | This parameter will indicate the main carrier id under which all replica carriers are defined for a single logical carrier.  It will increase in sequential order for each logical main carrier.  Note:  |
| **`replicaId`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELNR/CHANNELGROUP` | Replica id | - | 1...6, step 1 | This parameter defines the Replica ID for either Lean GSM or CMST feature. In Lean GSM, it should be considered as Beam ID. In Composited Multi Site Transmission (CMST), it should be considered as Nod |
| **`antlDN`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELNR/CHANNELGROUP/CHANNEL` | Distinguished Name of antenna line | - | 1...2048 characters | Distinguished name of object ANTL or ASIANTL.  Distinguished name can be either Fully Distinguished Name (FDN) or shortened one as long as it is unambiguous within the network element configuration. E |
| **`channelId`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELNR/CHANNELGROUP/CHANNEL` | Channel identifier | - | 1...128, step 1 | Instance identifier of the object CHANNEL. |
| **`direction`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELNR/CHANNELGROUP/CHANNEL` | Direction of the channel | - | 1:TX;
2:RX | States the direction of the channel of the related antenna line. |
| **`iqStreamId`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELNR/CHANNELGROUP/CHANNEL` | I/Q Data Stream Identifier | - | 0...127, step 1 | For CHANNELGROUP with multiple CHANNEL objects of the same direction (Tx or Rx), this parameter defines I/Q data stream which eNB or gNB shall assign to the CHANNEL. This parameter can be used to swit |
| **`resourceDN`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELNR/CHANNELGROUP/CHANNEL` | Distinguished Name of resource | - | 1...2048 characters | Distinguished name of object resource that belongs to this CHANNEL. This parameter is only valid for LTE and 5G cells (LCELL and LCELNR objects).  Distinguished name can be either Fully Distinguished  |
| **`actDynamicSharedSpectrum`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELW` | Activate dynamic shared spectrum | - | 0 (false), 1 (true) | This parameter enables dynamic spectrum sharing |
| **`actWcdmaLteSharedSpectrum`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELW` | Activate WCDMA and LTE shared spectrum | - | 0:Disable;
1:Static Shared Spectrum;
2:Dynamic Shared Spectrum | This parameter activates WCDMA and LTE shared spectrum functionality Value Disable means WCDMA LTE spectrum sharing is disabled, Value Static Shared Spectrum means WCDMA LTE static spectrum sharing is |
| **`bandNumber`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELW` | Band Number | - | 1...32, step 1 | This parameter contains the WCDMA band number. Current UARFCN value received from RNC during cell setup can be checked in WNBTS/WNCEL.uarfcn parameter. Value set in this parameter should be consistent |
| **`dynamicSharedSpectrumGsmCellDN`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELW` | Dynamic shared spectrum GSM cell distinguished name | - | 1...400 characters | The Distinguished Name of the associated GSM cell used in shared spectrum.  Distinguished name can be either Fully Distinguished Name (FDN) or shortened one as long as it is unambiguous within the net |
| **`intShutdownTimeout`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELW` | Intelligent shutdown timeout | - | 0...9999, step 1 min | This parameter denotes timeout for intelligent shutdown in minutes. The value of "0" means that cell is immediately shut down with high priority. If parameter isn't present in LCELW object, it means t |
| **`lCelwId`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELW` | Local cell resource identifier | - | 0...255, step 1 | This is the instance identifier of the WCDMA local cell resource object (LCELW). A local cell resource consists of the HW required by one cell for transmission and receiving. The local cell resource i |
| **`wcdmaFilteredBandwidthDL`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELW` | WCDMA filtered bandwidth DL | - | 0:0 MHz;
1:0.6 MHz;
2:1.2 MHz | The parameter indicates the amount of WCDMA spectrum bandwidth shared with LTE inside WCDMA modulated channel bandwidth in down link.  This parameter is used only when actWcdmaLteSharedSpectrum:MNL/MN |
| **`channelGroupId`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELW/CHANNELGROUP` | Channel Group identifier | - | 1...36, step 1 | Instance identifier of the object CHANNELGROUP. In case the cell is a  "Super Cell" or "Liquid Cell" the CHANNELGROUP contains the related CHANNEL objects of the subcell, otherwise it contains the CHA |
| **`mainCarrierId`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELW/CHANNELGROUP` | Main carrier id | - | 1...12, step 1 | This parameter will indicate the main carrier id under which all replica carriers are defined for a single logical carrier.  It will increase in sequential order for each logical main carrier.  Note:  |
| **`replicaId`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELW/CHANNELGROUP` | Replica id | - | 1...6, step 1 | This parameter defines the Replica ID for either Lean GSM or CMST feature. In Lean GSM, it should be considered as Beam ID. In Composited Multi Site Transmission (CMST), it should be considered as Nod |
| **`antlDN`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELW/CHANNELGROUP/CHANNEL` | Distinguished Name of antenna line | - | 1...2048 characters | Distinguished name of object ANTL or ASIANTL.  Distinguished name can be either Fully Distinguished Name (FDN) or shortened one as long as it is unambiguous within the network element configuration. E |
| **`channelId`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELW/CHANNELGROUP/CHANNEL` | Channel identifier | - | 1...128, step 1 | Instance identifier of the object CHANNEL. |
| **`direction`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELW/CHANNELGROUP/CHANNEL` | Direction of the channel | - | 1:TX;
2:RX | States the direction of the channel of the related antenna line. |
| **`iqStreamId`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELW/CHANNELGROUP/CHANNEL` | I/Q Data Stream Identifier | - | 0...127, step 1 | For CHANNELGROUP with multiple CHANNEL objects of the same direction (Tx or Rx), this parameter defines I/Q data stream which eNB or gNB shall assign to the CHANNEL. This parameter can be used to swit |
| **`resourceDN`** | `MRBTS/MNL/MNLENT/CELLMAPPING/LCELW/CHANNELGROUP/CHANNEL` | Distinguished Name of resource | - | 1...2048 characters | Distinguished name of object resource that belongs to this CHANNEL. This parameter is only valid for LTE and 5G cells (LCELL and LCELNR objects).  Distinguished name can be either Fully Distinguished  |
| **`certhentId`** | `MRBTS/MNL/MNLENT/CERTHENT` | Identifier of CERTHENT | - | 1...1, step 1 | Identifier of CERTHENT instance |
| **`cmpCrlSrcIpv4AddressDN`** | `MRBTS/MNL/MNLENT/CERTHENT` | Source IP address used for CMP/CRL Servers | - | 1...400 characters | This parameter defines the reference to the IPADDRESSV4 object instance which holds the IPv4 address that BTS uses as source IP address in all communications with CMP/CRL servers. If this parameter is |
| **`cmpCrlSrcIpv6AddressDN`** | `MRBTS/MNL/MNLENT/CERTHENT` | Source IP address used for CMP/CRL Servers | - | 1...400 characters | This parameter defines the reference to the IPADDRESSV6 object instance which holds the IPv6 address that BTS uses as source IP address in all communications with CMP/CRL servers. If this parameter is |
| **`authorityKeyIdentifier`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERTFH_R` | Certificate authority key identifier | - | 0...128 characters | This parameter specifies the identifier of the public key corresponding to the private key that is used to sign the certificate. |
| **`caType`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERTFH_R` | CA certificate type | - | 1:Trust Anchor;
2:Intermediate Certificate Authority;
3:Registration Authority | This parameter indicates the type of Certificate Authority (CA) certificate. The CA Certificate type could be TA (Trust Anchor)/RA(Registration authority)/Intermediate CA (Certificate Authority). |
| **`cacertFhRId`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERTFH_R` | Certificate authority certificate for fronthaul instance identifier | - | 1...86, step 1 | This parameter uniquely identifies the read-only instance of the Certificate Authority Certificate object for Fronthaul (CACERTFH_R) within the same containing MNL/MNLENT/CERTHENT object instance. Thi |
| **`crlDpURI`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERTFH_R` | Certificate CRL distribution point URI | - | 0...1024 characters | This parameter lists the first CRL distribution point URI that is included in the certificate. |
| **`extendedKeyUsage`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERTFH_R` | Certificate extended key usage | - | 0...32 characters | The parameter indicates one or more purposes for which the certified public key may be used, in addition to or in place of the basic purposes indicated in the key usage. It is a string of IDs separate |
| **`fingerprint`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERTFH_R` | Certificate fingerprint | - | 0...128 characters | This parameter is the certificate fingerprint of a certificate. The certificate fingerprint is unique for each certificate issued by the same CA. It should be in "Hex ASCII" format with "FF:EE:DD". |
| **`issuedTo`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERTFH_R` | Certificate issued to | - | 0...1000 characters | This parameter is used to identify the Distinguished Name (DN) of entity that was issued the certificate. |
| **`issuer`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERTFH_R` | Certificate issued by | - | 0...1000 characters | This parameter is used to identify the signing Certificate Authority(CA) that issued the certificate. This would provide the DN information for the CA. |
| **`keyPoolType`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERTFH_R` | Key pool type | - | 1:RSA;
2:ECDSA;
3:Common | This parameter is used to differentiate RSA/ECDSA own trust chain certificates from additional TA/CA certificates.  - 'RSA' is assigned to RSA own trust chain in which end entity certificate is RSA ty |
| **`keyUsage`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERTFH_R` | Certificate key usage | - | 0...16 characters | The parameter defines the purpose (e.g., encipherment, signature, certificate signing) of the key contained in the certificate. It is a bit string. When a bit is set to 1, it means the key usage corre |
| **`serialNumber`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERTFH_R` | Certificate serial number | - | 0...40 characters | This parameter is used to identify the serial number of the issued certificate. The serial number should be unique for each certificate issued by a CA. In accordance with RFC 3280, serialNumber must a |
| **`signatureAlgorithm`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERTFH_R` | Certificate signature algorithm | - | 0...128 characters | This parameter specifies the cryptographic algorithm used by the CA to sign this certificate. Possible values include those specified in [RFC3279], [RFC4055], [RFC4491], [RFC 5480] and 3GPP 33.310.  F |
| **`source`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERTFH_R` | CA certificate source | - | 0:Vendor;
1:Operator | This parameter indicates whether the certificate is created by vendor or operator. |
| **`subjectAlternateName`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERTFH_R` | Certificate subject alternative name | - | 0...1024 characters | This parameter identifies the subject alternative name to be bound to the certificate. It could be an Internet electronic mail, address, a DNS name, an IP address, and a Uniform Resource Identifier (U |
| **`subjectKeyIdentifier`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERTFH_R` | Certificate subject key identifier | - | 0...128 characters | This parameter specifies the identifier that can be used to identify the certificates that contain a particular public key |
| **`subjectPublicKeyAlgorithm`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERTFH_R` | Certificate subject public key algorithm | - | 0...128 characters | This parameter specifies the cryptographic algorithm the public key in the certificate is to be used with. Possible values include those specified in [RFC3279], [RFC4055], [RFC4491], [RFC 5480] and 3G |
| **`trustChain`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERTFH_R` | Certificate trust chain | - | 0:BTS Operator Certificate Trust Chain;
1:BTS Operator Certificate  RA Trust Chain;
2:BTS Vendor Certificate Trust Chain;
3:Other Trust Chain | This parameter specifies the trust chain that the CA certificate belongs to. |
| **`validFrom`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERTFH_R` | Certificate valid from | - | 0...32 characters | This parameter is used to indicate the timestamp from which the certificate is valid. The format is: YYYY-MM-DDTHH:MM:SS.SSS[+-]hh:mm where hh:mm is the offset from GMT. |
| **`validTo`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERTFH_R` | Certificate valid to | - | 0...32 characters | This parameter is used to indicate the timestamp up to which the certificate is valid. The format is: YYYY-MM-DDTHH:MM:SS.SSS[+-]hh:mm where hh:mm is the offset from GMT. |
| **`authorityKeyIdentifier`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERT_R` | Certificate authority key identifier | - | 0...128 characters | This parameter specifies the identifier of the public key corresponding to the private key that is used to sign the certificate. |
| **`caType`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERT_R` | CA certificate type | - | 1:Trust Anchor;
2:Intermediate Certificate Authority;
3:Registration Authority | This parameter indicates the type of Certificate Authority (CA) certificate. The CA Certificate type could be TA (Trust Anchor)/RA(Registration authority)/Intermediate CA (Certificate Authority). |
| **`cacertRId`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERT_R` | Certificate authority certificate identifier | - | 1...106, step 1 | This parameter is the instance identifier of the Certificate Authority Certificate object (CACERT). This object can contain certificate of a Trust Anchor (TA), Intermediate CA (CA) or Registration Aut |
| **`crlDpURI`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERT_R` | Certificate CRL distribution point URI | - | 0...1024 characters | This parameter lists the first CRL distribution point URI that is included in the certificate. |
| **`extendedKeyUsage`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERT_R` | Certificate extended key usage | - | 0...32 characters | The parameter indicates one or more purposes for which the certified public key may be used, in addition to or in place of the basic purposes indicated in the key usage. It is a string of IDs separate |
| **`fingerprint`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERT_R` | Certificate fingerprint | - | 0...128 characters | This parameter is the certificate fingerprint of a certificate. The certificate fingerprint is unique for each certificate issued by the same CA. It should be in "Hex Ascii" format with "FF:EE:DD". |
| **`issuedTo`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERT_R` | Certificate issued to | - | 0...1000 characters | This parameter is used to identify the Distinguished Name (DN) of entity that was issued the certificate. |
| **`issuer`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERT_R` | Certificate issued by | - | 0...1000 characters | This parameter is used to identify the signing Certificate Authority(CA) that issued the certificate. This would provide the DN information for the CA. |
| **`keyPoolType`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERT_R` | Key pool type | - | 1:RSA;
2:ECDSA;
3:Common | This parameter is used to differentiate RSA/ECDSA own trust chain certificates from additional TA/CA certificates  'RSA' is assigned to RSA own trust chain in which end entity certificate is RSA type  |
| **`keyUsage`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERT_R` | Certificate key usage | - | 0...16 characters | The parameter defines the purpose (e.g., encipherment, signature, certificate signing) of the key contained in the certificate. It is a bit string. When a bit is set to 1, it means the key usage corre |
| **`serialNumber`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERT_R` | Certificate serial number | - | 0...40 characters | This parameter is used to identify the serial number of the issued certificate. The serial number should be unique for each certificate issued by a CA. In accordance with RFC 3280, serialNumber must a |
| **`signatureAlgorithm`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERT_R` | Certificate signature algorithm | - | 0...128 characters | This parameter specifies the cryptographic algorithm used by the CA to sign this certificate. Possible values include those specified in [RFC3279], [RFC4055], [RFC4491], [RFC 5480] and 3GPP 33.310.  F |
| **`source`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERT_R` | CA certificate source | - | 0:Vendor;
1:Operator | This parameter indicates whether the certificate is created by vendor or operator. |
| **`subjectAlternateName`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERT_R` | Certificate subject alternative name | - | 0...1024 characters | This parameter identifies the subject alternative name to be bound to  the certificate. It could be an Internet electronic mail, address, a DNS name, an IP address, and a Uniform Resource Identifier ( |
| **`subjectKeyIdentifier`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERT_R` | Certificate subject key identifier | - | 0...128 characters | This parameter specifies the identifier that can be used to identify the certificates that contain a particular public key |
| **`subjectPublicKeyAlgorithm`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERT_R` | Certificate subject public key algorithm | - | 0...128 characters | This parameter specifies the cryptographic algorithm the public key in the certificate is to be used with. Possible values include those specified in [RFC3279], [RFC4055], [RFC4491], [RFC 5480] and 3G |
| **`trustChain`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERT_R` | Certificate trust chain | - | 0:BTS Operator Certificate Trust Chain;
1:BTS Operator Certificate  RA Trust Chain;
2:BTS Vendor Certificate Trust Chain;
3:Other Trust Chain | This parameter specifies the trust chain that the CA certificate belongs to. |
| **`validFrom`** | `MRBTS/MNL/MNLENT/CERTHENT/CACERT_R` | Certificate valid from | - | 0...32 characters | This parameter is used to indicate the timestamp from which the certificate is valid. The format is: YYYY-MM-DDTHH:MM:SS.SSS[+-]hh:mm where hh:mm is the offset from GMT. |
