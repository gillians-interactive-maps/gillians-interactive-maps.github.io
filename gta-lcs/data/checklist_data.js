// Complete GTA: Liberty City Stories 100% Completion & Optional Tasks Database
const CHECKLIST_DATA = {
  categories: [
    {
      id: "story_portland",
      name: "Story Missions — Portland (33)",
      icon: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2L1 21h22L12 2zm0 3.8L19.5 19h-15L12 5.8zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/></svg>`,
      requiredFor100: true,
      items: [
        { id: "sm_home_sweet_home", title: "Home Sweet Home", giver: "Vincenzo Cilli", island: "Portland", required: true, reward: "Safehouse, Leone Suit Outfit" },
        { id: "sm_slacker", title: "Slacker", giver: "Vincenzo Cilli", island: "Portland", required: true, reward: "$100" },
        { id: "sm_dealing_revenge", title: "Dealing Revenge", giver: "Vincenzo Cilli", island: "Portland", required: true, reward: "$500, Baseball Bat at Safehouses" },
        { id: "sm_snuff", title: "Snuff", giver: "Vincenzo Cilli", island: "Portland", required: true, reward: "$500, Ammu-Nation Unlocked" },
        { id: "sm_smash_and_grab", title: "Smash and Grab", giver: "Vincenzo Cilli", island: "Portland", required: true, reward: "$1,000" },
        { id: "sm_hot_wheels", title: "Hot Wheels", giver: "Vincenzo Cilli", island: "Portland", required: true, reward: "Pay 'n' Spray Unlocked" },
        { id: "sm_bone_voyeur", title: "Bone Voyeur!", giver: "JD O'Toole", island: "Portland", required: true, reward: "$500" },
        { id: "sm_don_in_60_seconds", title: "Don in 60 Seconds", giver: "JD O'Toole", island: "Portland", required: true, reward: "$1,000, Overalls Outfit" },
        { id: "sm_a_volatile_situation", title: "A Volatile Situation", giver: "JD O'Toole", island: "Portland", required: true, reward: "$1,000" },
        { id: "sm_blow_up_dolls", title: "Blow Up 'Dolls'", giver: "JD O'Toole", island: "Portland", required: true, reward: "$1,500" },
        { id: "sm_snappy_dresser", title: "Snappy Dresser", giver: "Ma Cipriani", island: "Portland", required: true, reward: "$100" },
        { id: "sm_big_rumble_little_china", title: "Big Rumble in Little China", giver: "Ma Cipriani", island: "Portland", required: true, reward: null },
        { id: "sm_grease_sucho", title: "Grease Sucho", giver: "Ma Cipriani", island: "Portland", required: true, reward: "$1,000, Low Rider Rumble Unlocked" },
        { id: "sm_dead_meat", title: "Dead Meat", giver: "Ma Cipriani", island: "Portland", required: true, reward: "$500" },
        { id: "sm_no_son_of_mine", title: "No Son of Mine", giver: "Ma Cipriani", island: "Portland", required: true, reward: null },
        { id: "sm_the_offer", title: "The Offer", giver: "Salvatore Leone", island: "Portland", required: true, reward: "$500" },
        { id: "sm_ho_selecta", title: "Ho Selecta!", giver: "Salvatore Leone", island: "Portland", required: true, reward: "$500" },
        { id: "sm_frighteners", title: "Frighteners", giver: "Salvatore Leone", island: "Portland", required: true, reward: "$1,000, Avenging Angels Outfit" },
        { id: "sm_rollercoaster_ride", title: "Rollercoaster Ride", giver: "Salvatore Leone", island: "Portland", required: true, reward: "$1,000, Chauffeur Outfit" },
        { id: "sm_shop_til_you_strop", title: "Shop 'Til You Strop", giver: "Maria Latore", island: "Portland", required: true, reward: "$100" },
        { id: "sm_taken_for_a_ride", title: "Taken for a Ride", giver: "Maria Latore", island: "Portland", required: true, reward: "$500" },
        { id: "sm_booby_prize", title: "Booby Prize", giver: "Maria Latore", island: "Portland", required: true, reward: "Street Races Unlocked" },
        { id: "sm_biker_heat", title: "Biker Heat", giver: "Maria Latore", island: "Portland", required: true, reward: "$1,500" },
        { id: "sm_overdose_of_trouble", title: "Overdose of Trouble", giver: "Maria Latore", island: "Portland", required: true, reward: "Goodfella Outfit" },
        { id: "sm_contra_banned", title: "Contra-Banned", giver: "Salvatore Leone", island: "Portland", required: true, reward: "$1,000" },
        { id: "sm_salvatores_salvation", title: "Salvatore's Salvation", giver: "JD O'Toole", island: "Portland", required: true, reward: "$1,500" },
        { id: "sm_the_guns_of_leone", title: "The Guns of Leone", giver: "JD O'Toole", island: "Portland", required: true, reward: "$3,000" },
        { id: "sm_calm_before_the_storm", title: "Calm Before the Storm", giver: "JD O'Toole", island: "Portland", required: true, reward: "$1,000" },
        { id: "sm_the_made_man", title: "The Made Man", giver: "JD O'Toole", island: "Portland", required: true, reward: "$1,500" },
        { id: "sm_the_portland_chainsaw_masquerade", title: "The Portland Chainsaw Masquerade", giver: "Vincenzo Cilli", island: "Portland", required: true, reward: "$3,000, Overalls Outfit" },
        { id: "sm_sindacco_sabotage", title: "Sindacco Sabotage", giver: "Salvatore Leone", island: "Portland", required: true, reward: "$1,500" },
        { id: "sm_the_trouble_with_triads", title: "The Trouble With Triads", giver: "Salvatore Leone", island: "Portland", required: true, reward: "$1,500" },
        { id: "sm_driving_mr_leone", title: "Driving Mr. Leone", giver: "Salvatore Leone", island: "Portland", required: true, reward: "$4,000, Staunton Island Access" }
      ]
    },
    {
      id: "story_staunton",
      name: "Story Missions — Staunton Island (22)",
      icon: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>`,
      requiredFor100: true,
      items: [
        { id: "sm_a_walk_in_the_park", title: "A Walk in the Park", giver: "Salvatore Leone", island: "Staunton", required: true, reward: "$1,500, Sweats Outfit" },
        { id: "sm_making_toni", title: "Making Toni", giver: "Salvatore Leone", island: "Staunton", required: true, reward: "$2,000, Antonio Outfit, Hitmen Cease" },
        { id: "sm_the_morgue_party_candidate", title: "The Morgue Party Candidate", giver: "Donald Love", island: "Staunton", required: true, reward: "$1,000" },
        { id: "sm_steering_the_vote", title: "Steering the Vote", giver: "Donald Love", island: "Staunton", required: true, reward: "$1,500 - $1,700" },
        { id: "sm_cam_pain", title: "Cam-Pain", giver: "Donald Love", island: "Staunton", required: true, reward: "$1,500" },
        { id: "sm_friggin_the_riggin", title: "Friggin' the Riggin'", giver: "Donald Love", island: "Staunton", required: true, reward: "$1,500, Heavy Weapons at Phil Cassidy's" },
        { id: "sm_love_and_bullets", title: "Love & Bullets", giver: "Donald Love", island: "Staunton", required: true, reward: "$2,000" },
        { id: "sm_counterfeit_count", title: "Counterfeit Count", giver: "Donald Love", island: "Staunton", required: true, reward: "$2,500" },
        { id: "sm_caught_in_the_act", title: "Caught in the Act", giver: "Salvatore Leone", island: "Staunton", required: true, reward: "$2,000" },
        { id: "sm_search_and_rescue", title: "Search and Rescue", giver: "Salvatore Leone", island: "Staunton", required: true, reward: "$2,000" },
        { id: "sm_taking_the_peace", title: "Taking the Peace", giver: "Salvatore Leone", island: "Staunton", required: true, reward: "$2,500" },
        { id: "sm_shoot_the_messenger", title: "Shoot the Messenger", giver: "Salvatore Leone", island: "Staunton", required: true, reward: "$3,000, Wiseguy Outfit" },
        { id: "sm_sayonara_sindaccos", title: "Sayonara Sindaccos", giver: "Leon McAffrey", island: "Staunton", required: true, reward: "$1,500" },
        { id: "sm_the_whole_9_yardies", title: "The Whole 9 Yardies", giver: "Leon McAffrey", island: "Staunton", required: true, reward: "$2,000" },
        { id: "sm_crazy_69", title: "Crazy '69'", giver: "Leon McAffrey", island: "Staunton", required: true, reward: "$2,000, Dragon Outfit" },
        { id: "sm_night_of_the_livid_dreads", title: "Night of the Livid Dreads", giver: "Leon McAffrey", island: "Staunton", required: true, reward: "$2,000" },
        { id: "sm_munitions_dump", title: "Munitions Dump", giver: "Leon McAffrey", island: "Staunton", required: true, reward: "$2,500" },
        { id: "sm_lc_confidential", title: "L.C. Confidential", giver: "Ned Burner", island: "Staunton", required: true, reward: "$1,500" },
        { id: "sm_the_passion_of_the_heist", title: "The Passion of the Heist", giver: "Ned Burner", island: "Staunton", required: true, reward: "$1,500" },
        { id: "sm_karmageddon", title: "Karmageddon", giver: "Ned Burner", island: "Staunton", required: true, reward: "$1,500, Karmageddon Side Mission" },
        { id: "sm_false_idols", title: "False Idols", giver: "Ned Burner", island: "Staunton", required: true, reward: "$1,500, Rocket Launcher at Phil Cassidy's" },
        { id: "sm_love_on_the_rocks", title: "Love on the Rocks", giver: "Donald Love", island: "Staunton", required: true, reward: "Shoreside Vale Safehouse & Island Access" }
      ]
    },
    {
      id: "story_shoreside",
      name: "Story Missions — Shoreside Vale (15)",
      icon: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`,
      requiredFor100: true,
      items: [
        { id: "sm_rough_justice", title: "Rough Justice", giver: "Salvatore Leone", island: "Shoreside", required: true, reward: "$2,500, Lawyer Outfit" },
        { id: "sm_dead_reckoning", title: "Dead Reckoning", giver: "Salvatore Leone", island: "Shoreside", required: true, reward: "$3,000" },
        { id: "sm_shogun_showdown", title: "Shogun Showdown", giver: "Salvatore Leone", island: "Shoreside", required: true, reward: "$3,000" },
        { id: "sm_panlantic_land_grab", title: "Panlantic Land Grab", giver: "Donald Love", island: "Shoreside", required: true, reward: "$3,000" },
        { id: "sm_stop_the_press", title: "Stop the Press", giver: "Donald Love", island: "Shoreside", required: true, reward: "$2,000" },
        { id: "sm_morgue_party_resurrection", title: "Morgue Party Resurrection", giver: "Donald Love", island: "Shoreside", required: true, reward: "$2,000" },
        { id: "sm_more_deadly_than_the_male", title: "More Deadly Than the Male", giver: "Toshiko Kasen", island: "Shoreside", required: true, reward: "$2,000, Minigun at Phil Cassidy's" },
        { id: "sm_cash_clash", title: "Cash Clash", giver: "Toshiko Kasen", island: "Shoreside", required: true, reward: "$3,000" },
        { id: "sm_a_date_with_death", title: "A Date With Death", giver: "Toshiko Kasen", island: "Shoreside", required: true, reward: "$2,000, Tuxedo Outfit" },
        { id: "sm_cash_in_kazukis_chips", title: "Cash in Kazuki's Chips", giver: "Toshiko Kasen", island: "Shoreside", required: true, reward: "$4,000" },
        { id: "sm_no_money_mo_problems", title: "No Money, Mo' Problems", giver: "8-Ball", island: "Shoreside", required: true, reward: null },
        { id: "sm_bringing_down_the_house", title: "Bringing Down the House", giver: "8-Ball", island: "Shoreside", required: true, reward: "$5,000" },
        { id: "sm_love_on_the_run", title: "Love on the Run", giver: "Donald Love", island: "Shoreside", required: true, reward: "$6,000" },
        { id: "sm_the_shoreside_redemption", title: "The Shoreside Redemption", giver: "Salvatore Leone", island: "Shoreside", required: true, reward: "$4,000" },
        { id: "sm_the_sicilian_gambit", title: "The Sicilian Gambit", giver: "Salvatore Leone", island: "Shoreside", required: true, reward: "$500,000, King Jumpsuit Outfit" }
      ]
    },
    {
      id: "collectibles",
      name: "Collectibles (146)",
      icon: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
      requiredFor100: true,
      items: [
        { id: "col_packages", title: "100 Hidden Packages", giver: "Liberty City", island: "All", required: true, count: 100, isCategoryLink: "hidden_packages", reward: "Safehouse Weapons & Armor, $50,000" },
        { id: "col_rampages", title: "20 Rampages", giver: "Liberty City", island: "All", required: true, count: 20, isCategoryLink: "rampages", reward: "M60 Delivered to All Safehouses" },
        { id: "col_stunts", title: "26 Unique Stunt Jumps", giver: "Liberty City", island: "All", required: true, count: 26, isCategoryLink: "unique_stunt_jumps", reward: "Cash Bonus Per Jump" }
      ]
    },
    {
      id: "side_activities",
      name: "Side Activities (27)",
      icon: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/></svg>`,
      requiredFor100: true,
      items: [
        // --- Odd Jobs (14) ---
        { id: "vm_paramedic", markerId: "vm_paramedic", subGroup: "Odd Jobs", title: "Paramedic (Level 12)", mobileTitle: "Paramedic (Level 9)", giver: "Sweeney General Hospital (Portland View)", island: "Portland", required: true, reward: "Infinite Sprint", coords: [-82.60, 101.30], desc: "Enter the Ambulance outside Sweeney General Hospital and complete Level 12 in one continuous run.", mobileDesc: "Enter the Ambulance outside Sweeney General Hospital and complete Level 9 in one continuous run." },
        { id: "vm_firefighter", markerId: "vm_firefighter", subGroup: "Odd Jobs", title: "Firefighter (Level 12)", mobileTitle: "Firefighter (Level 9)", giver: "Harwood Fire Station (Portland)", island: "Portland", required: true, reward: "Fireproof Toni", coords: [-65.10, 99.80], desc: "Enter the Fire Truck outside Harwood Fire Station and extinguish 12 vehicle fires in a row.", mobileDesc: "Enter the Fire Truck outside Harwood Fire Station and extinguish 9 vehicle fires in a row." },
        { id: "vm_vigilante", markerId: null, subGroup: "Odd Jobs", title: "Vigilante (Level 12)", mobileTitle: "Vigilante (Level 9)", giver: "Police Car / Enforcer", island: "All", required: true, reward: "150 Maximum Armor", coords: null, desc: "Eliminate criminals up to Level 12 in a row in a police vehicle on any island.", mobileDesc: "Eliminate criminals up to Level 9 in a row in a police vehicle on any island." },
        { id: "vm_taxi", markerId: null, subGroup: "Odd Jobs", title: "Taxi Driver (100 Total Fares)", giver: "Taxi / Cabbie", island: "All", required: true, reward: "Bickle '76 Taxi Unlocked at Mean Street Taxis", coords: null, desc: "Accumulate 100 fares total in any taxi or cabbie across Liberty City." },
        { id: "vm_pizza_delivery", markerId: "vm_pizza_delivery", subGroup: "Odd Jobs", title: "Pizza Delivery (Level 10)", giver: "Joe's Pizza (Bedford Point)", island: "Staunton", required: true, reward: "+25 Max Health", coords: [-109.25, 65.69], desc: "Deliver pizzas on the Pizza Boy scooter parked at Joe's Pizza in Bedford Point." },
        { id: "vm_noodle_delivery", markerId: "vm_noodle_delivery", subGroup: "Odd Jobs", title: "Noodle Delivery (Level 10)", giver: "Punk Noodles (Chinatown)", island: "Portland", required: true, reward: "+25 Max Health", coords: [-88.75, 94.62], desc: "Deliver noodles on the Noodle Faggio parked in Chinatown." },
        { id: "sj_car_salesman", markerId: "sj_car_salesman", subGroup: "Odd Jobs", title: "Car Salesman (Level 6)", giver: "Capital Autos (Harwood)", island: "Portland", required: true, reward: "$4,000/day asset at Capital Autos, Hellenbach GT", coords: [-65.20, 96.84], desc: "Sell 4 of each vehicle category (Fast, Normal, Tough, Cheap) up to Level 6." },
        { id: "sj_trashmaster_portland", markerId: "sj_trashmaster_portland", subGroup: "Odd Jobs", title: "Trash Dash — Portland", giver: "Harwood Scrapyard", island: "Portland", required: true, reward: "$2,000", coords: [-64.45, 101.65], desc: "Collect all dumpsters on Portland within the time limit." },
        { id: "sj_trashmaster_staunton", markerId: "sj_trashmaster_staunton", subGroup: "Odd Jobs", title: "Trash Dash — Staunton Island", giver: "Carson General Hospital (Rockford)", island: "Staunton", required: true, reward: "$3,000", coords: [-63.60, 74.00], desc: "Collect all dumpsters on Staunton within the time limit (vehicle in Carson General Hospital parking lot)." },
        { id: "sj_trashmaster_shoreside", markerId: "sj_trashmaster_shoreside", subGroup: "Odd Jobs", title: "Trash Dash — Shoreside Vale", giver: "Francis International Airport (Hillside)", island: "Shoreside", required: true, reward: "$4,000, Trashmaster spawns at Harwood Scrapyard", coords: [-76.90, 35.60], desc: "Collect all dumpsters on Shoreside within the time limit." },
        { id: "sj_avenging_portland", markerId: "sj_avenging_portland", subGroup: "Odd Jobs", title: "Avenging Angels — Portland (Level 15)", giver: "Chinatown", island: "Portland", required: true, reward: "$1,500, Avenger motorcycle at Saint Mark's safehouse", coords: [-85.20, 93.50], desc: "Complete 15 levels of vigilante justice with the Angels on Portland." },
        { id: "sj_avenging_staunton", markerId: "sj_avenging_staunton", subGroup: "Odd Jobs", title: "Avenging Angels — Staunton (Level 15)", giver: "Belleville Park", island: "Staunton", required: true, reward: "$1,500, Never lose money when busted", coords: [-82.30, 65.40], desc: "Complete 15 levels of vigilante justice with the Angels on Staunton." },
        { id: "sj_avenging_shoreside", markerId: "sj_avenging_shoreside", subGroup: "Odd Jobs", title: "Avenging Angels — Shoreside (Level 15)", giver: "Wichita Gardens", island: "Shoreside", required: true, reward: "$1,500, Hero Garb Outfit at all safehouses", coords: [-65.80, 44.20], desc: "Complete 15 levels of vigilante justice with the Angels on Shoreside Vale." },
        { id: "sj_car_giveaway", markerId: null, subGroup: "Odd Jobs", title: "Car-azy Car Give Away (16 Vehicles)", giver: "Love Media Garage (Portland Docks)", island: "Portland", required: true, reward: "Generates up to $4,000/day asset cash", coords: [-98.20, 115.30], desc: "Deliver all 16 requested vehicles to Donald Love's lockup garage at Portland Docks." },

        // --- Challenges (3) ---
        { id: "sj_slash_tv", markerId: "slash_tv_lcs_stv_0", subGroup: "Challenges", title: "Slash TV (Level 5 Chainsaw Survival)", giver: "Atlantic Quays (Freighter Ship)", island: "Portland", required: true, reward: "Cox Mascot Outfit at all safehouses, $1,500", coords: [-100.32, 114.72], desc: "Survive waves of chainsaw attackers inside the cargo freighter." },
        { id: "sj_see_the_sights", markerId: "see_the_sight_before_your_flight_lcs_ssbyf_0", subGroup: "Challenges", title: "See the Sights Before Your Flight", giver: "Francis Int. Airport (Terminal Booth)", island: "Shoreside", required: true, reward: "Bulletproof Landstalker at airport, $1,000", coords: [-87.99, 43.24], desc: "Drive tourists around 12 Liberty City landmarks and take photos." },
        { id: "sj_bumps_and_grinds", markerId: "bumps_and_grinds_lcs_bng_0", subGroup: "Challenges", title: "Bumps & Grinds (10 Courses)", giver: "Harwood Dirt Track", island: "Portland", required: true, reward: "Sanchez and Manana spawn at Dirt Track, $1,500", coords: [-63.52, 89.49], desc: "Complete all 10 timed courses on the Sanchez dirt bike." },

        // --- Races (10) ---
        { id: "race_low_rider", markerId: "car_races_lcs_car_races_0", subGroup: "Races", title: "Street Race: Low Rider Rumble", giver: "Payphone (Trenton)", island: "Portland", required: true, reward: "$1,500", coords: [-90.88, 103.20] },
        { id: "race_red_light", markerId: "bike_races_lcs_bike_races_0", subGroup: "Races", title: "Street Race: Red Light Racing", giver: "Payphone (Chinatown)", island: "Portland", required: true, reward: "$1,500", coords: [-84.53, 91.01] },
        { id: "race_deimos_dash", markerId: "car_races_lcs_car_races_1", subGroup: "Races", title: "Street Race: Deimos Dash", giver: "Payphone (Aspatria)", island: "Staunton", required: true, reward: "$1,500", coords: [-63.50, 61.50] },
        { id: "race_torrington_tt", markerId: "bike_races_lcs_bike_races_1", subGroup: "Races", title: "Street Race: Torrington TT", giver: "Payphone (Torrington South)", island: "Staunton", required: true, reward: "$1,500", coords: [-107.81, 65.16] },
        { id: "race_gangsta_gp", markerId: "bike_races_lcs_bike_races_2", subGroup: "Races", title: "Street Race: Gangsta GP", giver: "Payphone (Pike Creek near Pay 'n' Spray)", island: "Shoreside", required: true, reward: "$1,500", coords: [-68.70, 32.45] },
        { id: "race_wi_cheetah", markerId: "car_races_lcs_car_races_2", subGroup: "Races", title: "Street Race: Wi-Cheetah Run", giver: "Payphone (Wichita Gardens East Block)", island: "Shoreside", required: true, reward: "$1,500", coords: [-67.19, 50.00] },
        { id: "rc_thrashing", markerId: "rc_races_lcs_rc_races_0", subGroup: "Races", title: "RC Race: Thrashing RC Buggies", giver: "Toyz Van (Hepburn Heights)", island: "Portland", required: true, reward: "$1,000", coords: [-69.67, 94.49] },
        { id: "rc_triad_take_down", markerId: "rc_triad_take_down_lcs_rc_ttd_0", subGroup: "Races", title: "RC Race: RC Triad Take-Down", giver: "Toyz Van (Chinatown)", island: "Portland", required: true, reward: "$1,000", coords: [-89.09, 96.75] },
        { id: "rc_ragin", markerId: "rc_races_lcs_rc_races_1", subGroup: "Races", title: "RC Race: Ragin' RC Buggies", giver: "Toyz Van (Belleville Park)", island: "Staunton", required: true, reward: "$1,000", coords: [-83.16, 66.68] },
        { id: "rc_chasin", markerId: "rc_races_lcs_rc_races_2", subGroup: "Races", title: "RC Race: Chasin' RC Buggies", giver: "Toyz Van (Francis Airport South Hangar)", island: "Shoreside", required: true, reward: "$1,000", coords: [-86.56, 37.97] }
      ]
    },
    {
      id: "optional_tasks",
      name: "Optional Tasks (Not Needed for 100%)",
      icon: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`,
      requiredFor100: false,
      items: [
        { id: "opt_9mm_mayhem", markerId: "drive_by_challenges_lcs_dbc_freeway_0", title: "9mm Mayhem (Drive-By Challenge)", giver: "Freeway Bike (Red Light)", island: "Portland", required: false, reward: "$1,500", coords: [-77.40, 94.28], desc: "Shoot targets as passenger on a motorcycle." },
        { id: "opt_scooter_shooter", markerId: "drive_by_challenges_lcs_dbc_faggio_0", title: "Scooter Shooter (Drive-By Challenge)", giver: "Faggio (Chinatown)", island: "Portland", required: false, reward: "$1,500", coords: [-89.78, 92.02], desc: "Shoot targets from the back of a Faggio scooter." },
        { id: "opt_awol_angel", markerId: "drive_by_challenges_lcs_dbc_angel_0", title: "AWOL Angel (Drive-By Challenge)", giver: "Angel Bike (Wichita Gardens)", island: "Shoreside", required: false, reward: "$1,500", coords: [-62.27, 42.66], desc: "Eliminate gang members during a fast bike chase." },
        { id: "opt_scrapyard", markerId: "checkpoint_challenges_lcs_cc_scrap_0", title: "Scrapyard Motorcycle Challenge", giver: "Sanchez (Junkyard)", island: "Portland", required: false, reward: "$4 x score", coords: [-63.98, 101.20] },
        { id: "opt_go_go_faggio", markerId: "checkpoint_challenges_lcs_cc_gogo_0", title: "Go-Go Faggio Checkpoint Challenge", giver: "Faggio (Newport under Callahan Bridge)", island: "Staunton", required: false, reward: "$1,000", coords: [-87.54, 78.36] },
        { id: "opt_slash_tv_extra", title: "Slash TV Level 6+ (Endless Mode)", giver: "Sawmill", island: "Portland", required: false, reward: "Cash bonus per kill", coords: [-100.32, 114.72] },
        { id: "opt_morgue_party_deliveries", title: "Love Media Corpse Deliveries", giver: "Donald Love Hearse", island: "Shoreside", required: false, reward: "Extra Cash" },
        { id: "opt_hidden_easter_eggs", title: "Discover 8 Hidden Easter Eggs", giver: "Liberty City", island: "All", required: false, reward: "Trophy & bragging rights" },
        { id: "opt_multiplayer", title: "Unlock Multiplayer Avatars (PSP)", giver: "Ad-Hoc Wireless", island: "All", required: false, platform: "psp_ps2", reward: "Multiplayer content & skins", desc: "Unlock multiplayer skins and avatars in Ad-Hoc multiplayer (PSP exclusive feature)." }
      ]
    }
  ]
};

if (typeof window !== 'undefined') {
  window.CHECKLIST_DATA = CHECKLIST_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CHECKLIST_DATA;
}
