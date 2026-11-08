/* Love Myself — all static content lives here */
window.DATA = (function () {
  /* ---------------------------------- trackers --------------------------------- */
  const PROTEIN = [
    { id: 'paneer', name: 'Paneer', qty: '100 g', g: 18, emoji: '🧀' },
    { id: 'dal', name: 'Dal', qty: '1 bowl', g: 9, emoji: '🥣' },
    { id: 'curd', name: 'Curd', qty: '1 cup', g: 8, emoji: '🍚' },
    { id: 'tofu', name: 'Tofu', qty: '100 g', g: 12, emoji: '🧊' },
    { id: 'soya', name: 'Soya chunks', qty: '30 g dry', g: 15, emoji: '🌱' },
    { id: 'sprouts', name: 'Sprouts', qty: '1 cup', g: 8, emoji: '🌿' },
    { id: 'whey', name: 'Whey', qty: '1 scoop', g: 24, emoji: '🥤' },
    { id: 'milk', name: 'Milk', qty: '1 cup', g: 8, emoji: '🥛' },
    { id: 'rajma', name: 'Rajma', qty: '1 bowl', g: 9, emoji: '🫘' },
    { id: 'chana', name: 'Roasted chana', qty: '30 g', g: 6, emoji: '🥜' },
    { id: 'peanuts', name: 'Peanuts', qty: '30 g', g: 7, emoji: '🥜' },
    { id: 'pb', name: 'Peanut butter', qty: '1 tbsp', g: 4, emoji: '🥄' },
    { id: 'besan', name: 'Besan chilla', qty: '1', g: 6, emoji: '🫓' },
    { id: 'cheese', name: 'Cheese slice', qty: '1', g: 5, emoji: '🧀' }
  ];

  const FIBER = [
    { id: 'salad', name: 'Salad bowl', qty: '1 bowl', g: 4, emoji: '🥗' },
    { id: 'fruit', name: 'Fruit', qty: '1', g: 3, emoji: '🍎' },
    { id: 'sabzi', name: 'Veg sabzi', qty: '1 serving', g: 4, emoji: '🥦' },
    { id: 'dal-f', name: 'Dal', qty: '1 serving', g: 5, emoji: '🥣' },
    { id: 'seeds', name: 'Chia / flax', qty: '1 spoon', g: 4, emoji: '🌾' },
    { id: 'oats', name: 'Oats', qty: '1 bowl', g: 4, emoji: '🥣' },
    { id: 'sprouts-f', name: 'Sprouts', qty: '1 cup', g: 3, emoji: '🌿' },
    { id: 'beans', name: 'Beans / rajma', qty: '1 serving', g: 6, emoji: '🫘' },
    { id: 'brownrice', name: 'Brown rice', qty: '1 cup', g: 2, emoji: '🍚' },
    { id: 'roti', name: 'Roti', qty: '1', g: 2, emoji: '🫓' },
    { id: 'cucumber', name: 'Cucumber', qty: '1', g: 1, emoji: '🥒' },
    { id: 'sweetpotato', name: 'Sweet potato', qty: '1', g: 3, emoji: '🍠' },
    { id: 'broccoli', name: 'Broccoli', qty: '1 cup', g: 3, emoji: '🥦' },
    { id: 'popcorn', name: 'Popcorn', qty: '1 bowl', g: 2, emoji: '🍿' }
  ];

  /* ----------------------------------- meals ----------------------------------- */
  const M = (type, name, emoji, protein, fiber, kcal, time, ingredients, steps) =>
    ({ type, name, emoji, protein, fiber, kcal, time, ingredients, steps });

  const MEALS = {
    0: [
      M('Breakfast', 'Moong dal chilla x2 + curd', '🥞', 18, 6, 340, 18,
        ['½ cup moong dal, soaked 2 hrs', '1 green chilli + coriander', '½ cup curd', '1 tsp oil'],
        ['Blend the soaked dal with chilli, coriander, salt and a splash of water into a pourable batter.',
          'Cook two thin chillas on a lightly oiled nonstick pan, about 2 min per side.',
          'Serve hot with curd.']),
      M('Lunch', '2 roti + rajma + salad', '🫘', 16, 12, 480, 20,
        ['1 cup cooked rajma', '1 onion + 1 tomato', '2 roti', 'Cucumber, tomato and lemon for salad'],
        ['Sauté chopped onion and tomato with cumin, chilli and salt until soft.',
          'Add rajma with a splash of water and simmer 10 min.',
          'Warm the rotis and toss the salad.']),
      M('Dinner', 'Paneer bhurji + 1 roti + salad', '🧀', 22, 7, 420, 15,
        ['100 g paneer, crumbled', '½ onion + 1 tomato', '1 roti', 'Salad greens'],
        ['Sauté onion and tomato with turmeric, chilli and salt.',
          'Add crumbled paneer and cook 4–5 min, stirring.',
          'Serve with a warm roti and salad.']),
      M('Snack', 'Fruit + almonds', '🍎', 4, 5, 180, 2,
        ['1 apple or orange', '10 almonds'],
        ['Chop the fruit, grab the almonds, done.'])
    ],
    1: [
      M('Breakfast', 'Veg oats upma + whey shake', '🥣', 28, 7, 380, 15,
        ['½ cup oats', 'Mixed veggies (carrot, peas, beans)', '1 scoop whey', 'Mustard seeds + curry leaves'],
        ['Toast the oats dry for 2 min, then set aside.',
          'Sauté mustard seeds, curry leaves and veggies; add oats, salt and 1 cup water. Cook 5 min.',
          'Shake the whey with water or milk and drink alongside.']),
      M('Lunch', 'Brown rice + sambar + beans poriyal + curd', '🍛', 18, 14, 520, 20,
        ['½ cup cooked brown rice', '1 cup sambar', '1 cup green beans', '½ cup curd'],
        ['Steam the beans and toss with grated coconut, mustard seeds and curry leaves.',
          'Warm the sambar and rice.',
          'Finish with curd.']),
      M('Dinner', 'Tofu stir-fry + clear soup', '🥦', 20, 8, 360, 15,
        ['100 g tofu, cubed', 'Mixed vegetables', '1 tsp soy sauce + garlic', '1 cup clear veg soup'],
        ['Pan-fry tofu until golden on the edges.',
          'Add garlic and vegetables, stir-fry 5 min, splash in soy sauce.',
          'Serve with a warm clear soup.']),
      M('Snack', 'Roasted chana', '🥜', 7, 5, 150, 1,
        ['30 g roasted chana', 'Lemon + chaat masala'],
        ['Toss chana with lemon and chaat masala.'])
    ],
    2: [
      M('Breakfast', 'Besan chilla with paneer filling', '🫓', 20, 6, 360, 15,
        ['½ cup besan', '50 g paneer, grated', 'Onion, tomato, coriander', '1 tsp oil'],
        ['Whisk besan with water, onion, tomato, coriander and salt.',
          'Pour one ladle onto a hot nonstick pan; add grated paneer and fold.',
          'Cook 2 min per side and serve.']),
      M('Lunch', '2 roti + chole + cucumber salad', '🥙', 17, 13, 500, 20,
        ['1 cup cooked chole', 'Onion-tomato masala', '2 roti', 'Cucumber + lemon'],
        ['Simmer chole in the masala with chole masala and salt for 10 min.',
          'Warm rotis.',
          'Toss cucumber with lemon and chaat masala.']),
      M('Dinner', 'Dal palak + 1 roti', '🥬', 15, 9, 340, 18,
        ['½ cup moong or toor dal', '2 cups spinach', 'Garlic + cumin', '1 roti'],
        ['Pressure cook the dal with turmeric and salt.',
          'Sauté garlic and cumin, add spinach until wilted, then stir in the dal.',
          'Serve with a roti.']),
      M('Snack', 'Sprouts chaat', '🌿', 8, 6, 160, 5,
        ['1 cup sprouted moong', 'Onion, tomato, coriander', 'Lemon + chaat masala'],
        ['Steam sprouts 3 min if you prefer them soft.',
          'Toss with chopped onion, tomato, coriander, lemon and chaat masala.'])
    ],
    3: [
      M('Breakfast', '3 idli + sambar + chutney', '🍥', 10, 6, 330, 15,
        ['3 idlis', '1 cup sambar', '2 tbsp coconut chutney'],
        ['Steam the idlis (or use leftover batter).',
          'Warm the sambar and chutney.',
          'Eat while warm — best breakfast in the world.']),
      M('Lunch', 'Veg pulao + raita', '🍚', 12, 8, 470, 20,
        ['½ cup rice', 'Mixed vegetables', '½ cup curd', 'Whole spices'],
        ['Sauté whole spices and vegetables, add rice and 1 cup water.',
          'Cook covered until fluffy.',
          'Serve with cucumber raita.']),
      M('Dinner', 'Air-fried paneer tikka + salad', '🍢', 24, 6, 390, 20,
        ['100 g paneer, cubed', '½ cup curd + tikka masala', 'Capsicum + onion', 'Salad'],
        ['Marinate paneer and veggies in curd and spices for 10 min.',
          'Air-fry at 190°C for 10–12 min, shaking halfway.',
          'Serve on a big salad.']),
      M('Snack', 'Fruit + curd', '🍑', 5, 4, 170, 2,
        ['1 seasonal fruit', '½ cup curd'],
        ['Chop fruit, spoon over curd.'])
    ],
    4: [
      M('Breakfast', 'Curd bowl with fruit, seeds, oats', '🥣', 14, 8, 350, 5,
        ['1 cup curd', '1 fruit', '2 tbsp oats', '1 tsp chia or flax'],
        ['Spoon curd into a bowl.',
          'Top with chopped fruit, oats and seeds.',
          'Add a drizzle of honey if you want.']),
      M('Lunch', '2 roti + mixed dal + bhindi', '🍲', 17, 14, 480, 20,
        ['½ cup mixed dal', '2 roti', '1 cup bhindi', 'Cumin + garlic'],
        ['Cook the dal with turmeric and salt.',
          'Sauté bhindi with cumin until crisp at the edges.',
          'Warm rotis and serve.']),
      M('Dinner', 'Soya chunk curry + 1 roti', '🍛', 20, 8, 400, 20,
        ['30 g soya chunks, boiled', 'Onion-tomato gravy', '1 roti', 'Coriander'],
        ['Boil and squeeze the soya chunks.',
          'Simmer them in onion-tomato gravy with spices for 8 min.',
          'Serve with a roti.']),
      M('Snack', 'Buttermilk + nuts', '🥛', 6, 3, 180, 2,
        ['1 glass buttermilk', '10 mixed nuts'],
        ['Blend curd with water, salt and cumin. Drink with nuts.'])
    ],
    5: [
      M('Breakfast', '1 paneer paratha + curd', '🫓', 18, 6, 420, 20,
        ['1 whole-wheat paratha', '50 g grated paneer', '½ cup curd', '1 tsp ghee'],
        ['Stuff the paratha with grated paneer, salt and coriander.',
          'Cook on a hot pan with a little ghee until golden.',
          'Serve with curd.']),
      M('Lunch', 'Burrito bowl: rice, black beans, corn, veggies', '🌯', 20, 15, 540, 20,
        ['½ cup rice', '½ cup black beans', '½ cup corn', 'Veggies + curd dressing'],
        ['Warm rice, beans and corn.',
          'Pile into a bowl with chopped veggies.',
          'Dress with curd, lime, cumin and chilli.']),
      M('Dinner', 'Clear veg soup + tofu or paneer sizzler', '🍲', 22, 9, 400, 20,
        ['100 g tofu or paneer', 'Mixed vegetables', '2 cups veg stock', 'Pepper + herbs'],
        ['Simmer vegetables in stock with pepper and herbs for 10 min.',
          'Sear tofu or paneer on a hot pan.',
          'Serve the sizzler on top of the soup.']),
      M('Snack', 'Fruit + whey shake', '🥤', 26, 3, 260, 3,
        ['1 scoop whey', '1 banana or fruit', 'Water or milk'],
        ['Shake whey with water or milk. Eat the fruit alongside.'])
    ],
    6: [
      M('Breakfast', 'Dosa + sambar', '🥞', 8, 5, 330, 15,
        ['2 dosas', '1 cup sambar', 'Coconut chutney'],
        ['Spread dosa batter thin on a hot pan.',
          'Cook until crisp and fold.',
          'Serve with sambar and chutney.']),
      M('Lunch', 'Dal, rice, sabzi, curd', '🍛', 15, 11, 520, 20,
        ['½ cup rice', '1 cup dal', '1 cup sabzi', '½ cup curd'],
        ['Cook rice and dal.',
          'Make a quick sabzi with whatever is in the fridge.',
          'Serve with curd. Sunday-style.']),
      M('Dinner', 'Light khichdi + curd', '🥣', 12, 8, 360, 15,
        ['½ cup rice + ½ cup moong dal', 'Cumin, turmeric, ginger', '½ cup curd'],
        ['Pressure cook rice and dal with turmeric, cumin and ginger.',
          'Mash slightly for a soft khichdi.',
          'Serve with curd.']),
      M('Snack', 'Anything mindful, no tracking pressure', '🌈', 0, 0, 0, 1,
        ['Whatever sounds kind'],
        ['Easy day rule: eat it slowly, enjoy it, no logging guilt.'])
    ]
  };

  /* -------------------------------- meal swaps -------------------------------- */
  const SWAPS = {
    Breakfast: [
      { name: 'Paneer bhurji + 2 toast', emoji: '🧀', protein: 22, fiber: 5, kcal: 380 },
      { name: 'Overnight oats + curd + chia', emoji: '🥣', protein: 16, fiber: 9, kcal: 350 },
      { name: 'Poha with peanuts + curd', emoji: '🍚', protein: 12, fiber: 6, kcal: 330 },
      { name: 'Tofu scramble + toast', emoji: '🍳', protein: 20, fiber: 5, kcal: 350 },
      { name: 'Whey shake + banana + oats', emoji: '🥤', protein: 28, fiber: 6, kcal: 380 },
      { name: 'Greek curd bowl + fruit + seeds', emoji: '🍓', protein: 18, fiber: 8, kcal: 320 },
      { name: 'Sprouts poha', emoji: '🌿', protein: 12, fiber: 7, kcal: 300 },
      { name: '2 moong chilla + mint chutney', emoji: '🥞', protein: 16, fiber: 5, kcal: 300 },
      { name: 'Besan chilla + paneer', emoji: '🫓', protein: 20, fiber: 6, kcal: 360 },
      { name: 'Idli + sambar', emoji: '🍥', protein: 10, fiber: 6, kcal: 330 }
    ],
    Lunch: [
      { name: 'Rajma chawal + salad', emoji: '🫘', protein: 18, fiber: 14, kcal: 520 },
      { name: 'Chole + 2 roti + salad', emoji: '🥙', protein: 17, fiber: 13, kcal: 500 },
      { name: 'Paneer + 2 roti + sabzi', emoji: '🧀', protein: 24, fiber: 10, kcal: 520 },
      { name: 'Soya pulao + raita', emoji: '🍚', protein: 20, fiber: 9, kcal: 480 },
      { name: 'Dal + rice + sabzi + curd', emoji: '🍛', protein: 15, fiber: 11, kcal: 500 },
      { name: 'Tofu burrito bowl', emoji: '🌯', protein: 22, fiber: 15, kcal: 540 },
      { name: 'Sambar rice + beans poriyal', emoji: '🥘', protein: 18, fiber: 14, kcal: 520 },
      { name: 'Curd rice + chana salad', emoji: '🥗', protein: 14, fiber: 8, kcal: 430 },
      { name: 'Mixed dal + 2 roti + bhindi', emoji: '🍲', protein: 17, fiber: 14, kcal: 480 },
      { name: 'Veg khichdi + curd', emoji: '🥣', protein: 14, fiber: 9, kcal: 420 }
    ],
    Dinner: [
      { name: 'Paneer tikka + salad', emoji: '🍢', protein: 24, fiber: 6, kcal: 390 },
      { name: 'Tofu stir-fry + soup', emoji: '🥦', protein: 20, fiber: 8, kcal: 360 },
      { name: 'Dal palak + roti', emoji: '🥬', protein: 15, fiber: 9, kcal: 340 },
      { name: 'Soya curry + roti', emoji: '🍛', protein: 20, fiber: 8, kcal: 400 },
      { name: 'Veg soup + paneer sizzler', emoji: '🍲', protein: 22, fiber: 9, kcal: 400 },
      { name: 'Khichdi + curd', emoji: '🥣', protein: 12, fiber: 8, kcal: 360 },
      { name: 'Palak paneer + 1 roti', emoji: '🥬', protein: 22, fiber: 8, kcal: 400 },
      { name: 'Sprouts curry + roti', emoji: '🌿', protein: 14, fiber: 10, kcal: 360 },
      { name: 'Mushroom-pea curry + roti', emoji: '🍄', protein: 10, fiber: 9, kcal: 330 },
      { name: 'Curd bowl + roasted veg', emoji: '🥗', protein: 14, fiber: 7, kcal: 320 }
    ],
    Snack: [
      { name: 'Fruit + almonds', emoji: '🍎', protein: 4, fiber: 5, kcal: 180 },
      { name: 'Roasted chana', emoji: '🥜', protein: 7, fiber: 5, kcal: 150 },
      { name: 'Sprouts chaat', emoji: '🌿', protein: 8, fiber: 6, kcal: 160 },
      { name: 'Fruit + curd', emoji: '🍑', protein: 5, fiber: 4, kcal: 170 },
      { name: 'Buttermilk + nuts', emoji: '🥛', protein: 6, fiber: 3, kcal: 180 },
      { name: 'Whey shake + banana', emoji: '🥤', protein: 26, fiber: 3, kcal: 260 },
      { name: 'Peanut butter toast', emoji: '🍞', protein: 8, fiber: 4, kcal: 220 },
      { name: 'Masala corn + lemon', emoji: '🌽', protein: 5, fiber: 5, kcal: 150 },
      { name: 'Cucumber + hummus', emoji: '🥒', protein: 4, fiber: 4, kcal: 140 },
      { name: 'Dates + walnuts', emoji: '🌰', protein: 3, fiber: 3, kcal: 180 }
    ]
  };

  /* Every swap gets a short, flexible recipe so the card never hides it. */
  function swapRecipe(name) {
    const parts = String(name).split(/\s*\+\s*/).map(function (s) { return s.trim(); }).filter(Boolean);
    const main = parts[0] || String(name);
    const sides = parts.slice(1);
    const ingredients = [main + ' (main portion)']
      .concat(sides.map(function (s) { return s + ' (on the side)'; }))
      .concat(['Salt, cumin, chilli + a little oil', 'Fresh coriander + lemon']);
    const steps = [
      'Prep everything first and keep the plate balanced: half veggies, a quarter protein, a quarter carbs.',
      'Cook ' + main.toLowerCase() + ' on a medium pan with a little oil and your spices, about 10–12 min, until warm and cooked through.',
      sides.length
        ? 'Warm or assemble ' + sides.join(' + ').toLowerCase() + ' alongside.'
        : 'Add a handful of salad or steamed veggies on the side.',
      'Finish with coriander and a squeeze of lemon. Eat slowly, no guilt.'
    ];
    return { ingredients, steps };
  }
  Object.keys(SWAPS).forEach(function (type) {
    SWAPS[type].forEach(function (s) {
      if (!s.ingredients) {
        const r = swapRecipe(s.name);
        s.ingredients = r.ingredients;
        s.steps = r.steps;
      }
      if (!s.time) s.time = 15;
    });
  });

  /* --------------------------------- workouts --------------------------------- */
  const ex = (emoji, name, reps, seconds, cue) => ({ emoji, name, reps, seconds, cue });

  const WORKOUTS = [
    {
      day: 0, emoji: '🏋️', type: 'strength', title: 'Strength · full body', subtitle: '3 rounds · 30 min', duration: 30,
      blocks: [
        { name: 'Warm-up · 5 min', items: ['March in place — 2 min', 'Arm circles — 30 sec each way', 'Hip circles — 30 sec each way', 'Leg swings — 10 per leg'] },
        {
          name: 'Circuit · 3 rounds', exercises: [
            ex('🦵', 'Squats', '12 reps', 45, 'Sit back like there is a chair behind you. Knees track over toes.'),
            ex('🍑', 'Glute bridges', '12 reps', 40, 'Squeeze at the top for a second. Ribs down.'),
            ex('💪', 'Incline / wall push-ups', '10 reps', 40, 'Hands on a table or wall. Body in one line.'),
            ex('🚶‍♀️', 'Reverse lunges', '10 per leg', 50, 'Step back, both knees bend. Hold a wall if wobbly.'),
            ex('🧴', 'Bottle rows', '12 reps', 45, 'Hinge forward, pull elbows back. Squeeze shoulder blades.'),
            ex('🧘‍♀️', 'Plank', '20–30 sec', 30, 'Knees down is always allowed. Breathe.')
          ]
        },
        { name: 'Cool-down · 5 min', items: ['Child’s pose — 45 sec', 'Quad stretch — 30 sec each side', 'Hamstring stretch — 30 sec each side', 'Slow breaths — 1 min'] }
      ]
    },
    {
      day: 1, emoji: '🏃‍♀️', type: 'run', title: 'Run-walk session', subtitle: 'Warm-up + intervals + stretch', duration: 30,
      blocks: [
        { name: 'Before you go', items: ['Sip 250–300 ml water 30–60 min before', 'Small snack if hungry: banana, 4–5 dates or PB toast', '5 min brisk walk to warm up'] },
        { name: 'Intervals', items: ['Follow this week’s pattern from the Run screen', 'Jog easy enough to talk in short sentences', 'Walk breaks are part of the plan, not failure'] },
        { name: 'Cool-down · 10 min', items: ['5 min easy walk', 'Calf, hamstring, quad, hip flexor, glute + child’s pose — 30 sec each side', 'Water + 20–25 g protein within an hour'] }
      ]
    },
    {
      day: 2, emoji: '🏋️‍♀️', type: 'strength', title: 'Strength · glutes + pull', subtitle: '3 rounds · 30 min', duration: 30,
      blocks: [
        { name: 'Warm-up · 5 min', items: ['March in place — 2 min', 'Cat-cow — 8 slow rounds', 'Hip circles — 30 sec each way', 'Bodyweight squats — 10'] },
        {
          name: 'Circuit · 3 rounds', exercises: [
            ex('🦵', 'Sumo squats', '12 reps', 45, 'Toes turned out, chest tall. Push the floor away.'),
            ex('🍑', 'Single-leg glute bridges', '10 per leg', 50, 'One foot planted, other knee hugged in. Keep hips level.'),
            ex('💪', 'Wall push-ups', '12 reps', 40, 'Elbows at 45°, not flared.'),
            ex('🪜', 'Step-ups', '10 per leg', 50, 'Use a sturdy stair. Press through the whole foot.'),
            ex('🧴', 'Towel rows', '12 reps', 45, 'Loop a towel around a door handle. Pull chest to hands.'),
            ex('🌙', 'Side plank (knees down ok)', '20 sec per side', 40, 'Stack shoulders over elbow. Hips lifted.')
          ]
        },
        { name: 'Cool-down · 5 min', items: ['Figure-4 glute stretch — 30 sec each side', 'Chest opener — 30 sec', 'Neck rolls — 30 sec', 'Slow breaths — 1 min'] }
      ]
    },
    {
      day: 3, emoji: '🏃‍♀️', type: 'run', title: 'Run-walk session', subtitle: 'Warm-up + intervals + stretch', duration: 30,
      blocks: [
        { name: 'Before you go', items: ['Sip 250–300 ml water 30–60 min before', 'Small snack if hungry: banana, 4–5 dates or PB toast', '5 min brisk walk to warm up'] },
        { name: 'Intervals', items: ['Follow this week’s pattern from the Run screen', 'Jog easy enough to talk in short sentences', 'Walk breaks are part of the plan, not failure'] },
        { name: 'Cool-down · 10 min', items: ['5 min easy walk', 'Calf, hamstring, quad, hip flexor, glute + child’s pose — 30 sec each side', 'Water + 20–25 g protein within an hour'] }
      ]
    },
    {
      day: 4, emoji: '🏋️', type: 'strength', title: 'Strength · core + shoulders', subtitle: '3 rounds · 30 min', duration: 30,
      blocks: [
        { name: 'Warm-up · 5 min', items: ['March in place — 2 min', 'Arm circles — 30 sec each way', 'Shoulder rolls — 20', 'Hip circles — 30 sec each way'] },
        {
          name: 'Circuit · 3 rounds', exercises: [
            ex('🦵', 'Squat pulses', '15 reps', 45, 'Small pulses at the bottom. Keep heels down.'),
            ex('🍑', 'Glute bridge march', '10 per leg', 50, 'Hold the bridge, lift one foot at a time.'),
            ex('💪', 'Knee push-ups', '8 reps', 40, 'Knees down, body long. Lower with control.'),
            ex('🚶‍♀️', 'Curtsy lunges', '10 per leg', 50, 'Cross one leg behind. Keep knees soft.'),
            ex('🧴', 'Bottle overhead press', '12 reps', 45, 'Press up, ribs stay down.'),
            ex('🐞', 'Dead bug', '10 per side', 45, 'Lower opposite arm and leg slowly. Back stays flat.')
          ]
        },
        { name: 'Cool-down · 5 min', items: ['Child’s pose — 45 sec', 'Shoulder stretch — 30 sec each side', 'Hip flexor stretch — 30 sec each side', 'Slow breaths — 1 min'] }
      ]
    },
    {
      day: 5, emoji: '🏃‍♀️', type: 'run', title: 'Run-walk + light core', subtitle: 'Warm-up + intervals + core', duration: 40,
      blocks: [
        { name: 'Before you go', items: ['Sip 250–300 ml water 30–60 min before', 'Small snack if hungry', '5 min brisk walk to warm up'] },
        { name: 'Intervals', items: ['Follow this week’s pattern from the Run screen', 'Keep it conversational', 'Walk breaks are part of the plan'] },
        { name: 'Light core · 5 min', items: ['Dead bug — 10 per side', 'Bird dog — 10 per side', 'Plank — 20–30 sec', 'Slow breaths'] },
        { name: 'Cool-down · 5 min', items: ['Easy walk until breathing settles', 'Calf + hamstring stretch — 30 sec each side', 'Water + protein within an hour'] }
      ]
    },
    {
      day: 6, emoji: '🌷', type: 'easy', title: 'Easy day · walk or stretch', subtitle: '20–30 min, nothing to prove', duration: 25,
      blocks: [
        { name: 'Pick one', items: ['Gentle walk — 20–30 min', 'Yoga or stretching — 15 min', 'Or rest completely. Also valid.'] },
        { name: 'If you stretch', items: ['Child’s pose — 1 min', 'Cat-cow — 10 rounds', 'Figure-4 glute — 30 sec each side', 'Slow breathing — 2 min'] }
      ]
    }
  ];

  /* ---------------------------------- run plan --------------------------------- */
  const RUN_PLAN = [
    { week: 1, jog: 1, walk: 2, reps: 8, note: 'Find your easy jog. If you can’t chat, slow down.' },
    { week: 2, jog: 1, walk: 2, reps: 8, note: 'Same as last week on purpose. Repeat is strength.' },
    { week: 3, jog: 2, walk: 2, reps: 6, note: 'Two minutes at a time. You’ve got this.' },
    { week: 4, jog: 2, walk: 2, reps: 6, note: 'Keep the jog slower than you think.' },
    { week: 5, jog: 3, walk: 2, reps: 5, note: 'Three minutes is a conversation, not a race.' },
    { week: 6, jog: 3, walk: 2, reps: 5, note: 'Notice your breathing settling between intervals.' },
    { week: 7, jog: 5, walk: 2, reps: 4, note: 'Five-minute blocks. Walk tall, not slumped.' },
    { week: 8, jog: 5, walk: 2, reps: 4, note: 'Same again. Consistency beats intensity.' },
    { week: 9, jog: 8, walk: 2, reps: 3, note: 'Eight minutes. Relax your shoulders.' },
    { week: 10, jog: 8, walk: 2, reps: 3, note: 'You’ve done this. Keep it easy.' },
    { week: 11, jog: 22, walk: 0, reps: 1, note: 'One easy 22-minute jog. No pace goal.' },
    { week: 12, jog: 25, walk: 0, reps: 1, note: 'Twenty-five minutes non-stop. Celebrate after.' }
  ];

  /* ----------------------------------- quotes ----------------------------------- */
  const Q = (t, tag) => ({ t, tag });
  const QUOTES = [
    Q('Wake up, soft heart. Today gets to be gentle with you ☀️', 'morning'),
    Q('You don’t have to earn your place in your own life 💗', 'morning'),
    Q('New day, same you, slightly more main character ✨', 'morning'),
    Q('Small steps still move the plot forward 🎬', 'morning'),
    Q('Drink your water, love. The day can wait 30 seconds 💧', 'morning'),
    Q('Today’s vibe: soft discipline, loud self-respect 💅', 'morning'),
    Q('You are allowed to start again at 9am, 2pm, or 9pm 🕘', 'morning'),
    Q('Morning check-in: breathe, sip, stretch, slay 🧘‍♀️', 'morning'),
    Q('The plan is kind. You are kind. Let’s go 🫶', 'morning'),
    Q('Your body isn’t a project. It’s your home 🏡', 'morning'),
    Q('Slow mornings build soft, strong lives 🌷', 'morning'),
    Q('One tiny thing done beats ten perfect things imagined 🌟', 'morning'),
    Q('You woke up for yourself today. That’s already a win 🏆', 'morning'),
    Q('Progress looks like showing up, not showing off 🌱', 'morning'),
    Q('Be the person your future self high-fives 🙌', 'morning'),
    Q('Today’s menu: protein, water, grace 🍽️', 'morning'),
    Q('Nothing about you needs fixing before breakfast ☕', 'morning'),
    Q('You’re not lazy, you’re healing. There’s a difference 🩹', 'morning'),
    Q('Make it easy on yourself. Easy is allowed 💛', 'morning'),
    Q('A calm start is still a strong start 🌤️', 'morning'),
    Q('Your worth is not a number on a scale. Never was 📉', 'morning'),
    Q('Good morning to the girl who keeps trying 💫', 'morning'),
    Q('Eat like you love yourself, because you do 🥗', 'morning'),
    Q('You don’t need a new you. You need a kinder one 💞', 'morning'),
    Q('Today, choose the version of you that rests AND tries 🌈', 'morning'),

    Q('Movement is a celebration, not a punishment 🎉', 'workout'),
    Q('You don’t have to be fast. You just have to go 🏃‍♀️', 'workout'),
    Q('10 minutes counts. 5 minutes counts. You count 💪', 'workout'),
    Q('Strong is a feeling before it’s a look 🫀', 'workout'),
    Q('Your legs can do hard things. So can your heart ❤️‍🔥', 'workout'),
    Q('Sweat is just your body saying “we’re doing this” 💦', 'workout'),
    Q('Walk like the playlist is your personal hype squad 🎧', 'workout'),
    Q('The hardest rep is the first one out the door 🚪', 'workout'),
    Q('Rest between sets. Rest between thoughts too 🧘', 'workout'),
    Q('You’re building strength, not punishing yourself 🧱', 'workout'),
    Q('Run your own pace. Literally 🐢', 'workout'),
    Q('One more minute. You’ve got a whole lifetime of them 💫', 'workout'),
    Q('Your body carried you here. Carry it kindly 🫶', 'workout'),
    Q('Sore today, stronger tomorrow 💥', 'workout'),
    Q('Move because it feels good, not because you feel bad 🕺', 'workout'),
    Q('The walk is the therapy. The playlist is the therapist 🎶', 'workout'),
    Q('Future you is stretching right now, thank her 🧘‍♀️', 'workout'),
    Q('Slow jog, big heart energy 🏅', 'workout'),
    Q('You showed up in leggings. That’s half the battle 🩳', 'workout'),
    Q('Strength looks good on you. So does rest 😌', 'workout'),

    Q('Low days are part of the story, not the end of it 🌧️', 'low-day'),
    Q('You don’t have to be okay to be loved 💗', 'low-day'),
    Q('Rest is productive. Sadness is information, not failure 📖', 'low-day'),
    Q('If today is heavy, do the tiniest kind thing for yourself 🫂', 'low-day'),
    Q('One glass of water. That’s the whole goal right now 💧', 'low-day'),
    Q('You’re allowed to do less and still be enough 🤍', 'low-day'),
    Q('Feelings are weather. You are the sky ☁️', 'low-day'),
    Q('Text the friend. Take the walk. Cancel the plan. All valid 💌', 'low-day'),
    Q('You’ve survived every hard day so far. That’s a record 🏆', 'low-day'),
    Q('Be as kind to yourself as you’d be to your best friend 👯‍♀️', 'low-day'),
    Q('Nothing is wrong with you for finding today hard 🌙', 'low-day'),
    Q('Softness is not weakness. It’s survival with style 🎀', 'low-day'),
    Q('Close the app. Drink water. Come back later. We’ll be here 💛', 'low-day'),
    Q('Your feelings deserve a seat at the table, not the whole restaurant 🍽️', 'low-day'),
    Q('Breathe in for 4. Out for 6. Repeat until human 🌬️', 'low-day'),
    Q('Bad mood, not bad life. It’ll pass 🌦️', 'low-day'),
    Q('You are not behind. You are having a human moment 🫶', 'low-day'),
    Q('Today’s win can be getting out of bed. Genuinely 🛏️', 'low-day'),
    Q('Sad is allowed. Shame is not invited 🚫', 'low-day'),
    Q('The sun will come back. So will your spark ☀️', 'low-day'),

    Q('Streaks are built on grace, not perfection 🧵', 'streak'),
    Q('Day by day, you’re becoming someone you trust 🤝', 'streak'),
    Q('Look at you, showing up for yourself 💅', 'streak'),
    Q('Consistency is just kindness repeated 💞', 'streak'),
    Q('Your streak isn’t a chain. It’s a garden 🌱', 'streak'),
    Q('You missed a day? The app forgives. So should you 🕊️', 'streak'),
    Q('15 days of showing up. Main character behaviour 🎬', 'streak'),
    Q('The streak is proof, not pressure 🏅', 'streak'),
    Q('One day at a time is the whole strategy 🗓️', 'streak'),
    Q('You’re not obsessed, you’re committed. There’s a difference ✨', 'streak'),
    Q('Every tick is a tiny “I love you” to future you 💗', 'streak'),
    Q('Streak days stack like little acts of self-respect 📚', 'streak'),
    Q('You’ve done this before. You can do it gently again 🔁', 'streak'),
    Q('The goal isn’t perfect days. It’s showing up days 🫶', 'streak'),
    Q('Quiet consistency is the flex 💪', 'streak'),
    Q('Your streak can bend. It doesn’t have to break 🌿', 'streak'),
    Q('Today’s tick is tomorrow’s confidence ✅', 'streak'),
    Q('You’re rewriting the “I always quit” story ✍️', 'streak'),
    Q('Days like this are why the streak matters 🌟', 'streak'),
    Q('Keep going, but keep it kind 🎀', 'streak'),

    Q('Easy day, easy heart. Nothing to prove today 🌸', 'easy-day'),
    Q('Rest is part of the plan, not a break from it 🛋️', 'easy-day'),
    Q('Gentle movement is still movement 🚶‍♀️', 'easy-day'),
    Q('Today’s goal: be soft with yourself 🧸', 'easy-day'),
    Q('Sundays are for slow mornings and second coffees ☕', 'easy-day'),
    Q('You can do the bare minimum and still be worthy 🫧', 'easy-day'),
    Q('Period days get a pass, not a punishment 🩸', 'easy-day'),
    Q('Stretch, sip, nap, repeat 🧘‍♀️', 'easy-day'),
    Q('A walk with no pace goal is still a win 🌳', 'easy-day'),
    Q('Easy mode isn’t cheating. It’s smart 💡', 'easy-day'),
    Q('Your body asked for rest. Listen to her 🫶', 'easy-day'),
    Q('Do less today so you can do more later 🌙', 'easy-day'),
    Q('Cozy is a valid aesthetic and a valid strategy 🧣', 'easy-day'),
    Q('Nothing to track but how you feel 💗', 'easy-day'),
    Q('Slow day, soft heart, same you 🌷', 'easy-day'),
    Q('Rest isn’t a reward. It’s a requirement 🔋', 'easy-day'),
    Q('Today, the only streak that matters is breathing 🌬️', 'easy-day'),
    Q('Let today be enough exactly as it is 🌤️', 'easy-day'),
    Q('You’re allowed to pause without losing progress ⏸️', 'easy-day'),
    Q('Gentle days make strong weeks 🌈', 'easy-day')
  ];

  /* ----------------------------------- treats ----------------------------------- */
  const TREAT_IDEAS = [
    'Pani puri (6 pieces)', 'A scoop of ice cream', '2 squares of dark chocolate',
    'A slice of pizza', '1 gulab jamun', 'A small brownie', 'Momos (steamed or fried)',
    'Masala dosa', 'Pav bhaji', 'A slice of cake', 'Vada pav', 'A cafe hot chocolate'
  ];

  /* ---------------------------------- groceries --------------------------------- */
  const GROCERY = [
    { group: 'Produce', emoji: '🥬', items: ['Spinach', 'Green beans', 'Capsicum', 'Onions', 'Tomatoes', 'Cucumber', 'Carrots', 'Peas', 'Broccoli', 'Mushrooms', 'Coriander', 'Lemons', 'Bananas', 'Apples / oranges', 'Ginger + garlic', 'Green chillies'] },
    { group: 'Protein', emoji: '🧀', items: ['Paneer (400 g)', 'Tofu (300 g)', 'Soya chunks', 'Moong dal', 'Toor dal', 'Mixed dal', 'Rajma', 'Chole', 'Black beans', 'Sprouted moong', 'Whey protein', 'Curd (1 kg)', 'Milk'] },
    { group: 'Pantry', emoji: '🫙', items: ['Oats', 'Besan', 'Rice', 'Brown rice', 'Whole-wheat flour', 'Idli / dosa batter', 'Peanuts', 'Almonds', 'Walnuts', 'Chia + flax seeds', 'Roasted chana', 'Peanut butter', 'Sambar powder', 'Chole masala', 'Tikka masala'] },
    { group: 'Extras', emoji: '🧺', items: ['Coconut chutney ingredients', 'Clear veg soup', 'Hummus', 'Buttermilk'] }
  ];

  /* ----------------------------------- badges ----------------------------------- */
  const BADGES = [
    { id: 'first', name: 'First run', emoji: '👟', desc: 'You laced up.' },
    { id: 'onek', name: '1 km non-stop', emoji: '🌱', desc: 'One whole kilometre without a walk break.' },
    { id: 'fivetotal', name: '5 km total', emoji: '✨', desc: 'Five kilometres of showing up.' },
    { id: 'tentotal', name: '10 km total', emoji: '💫', desc: 'Double digits.' },
    { id: 'fivesingle', name: '5 km in one run', emoji: '🏅', desc: 'A proper long one.' },
    { id: 'tenruns', name: '10 runs', emoji: '🎽', desc: 'Habit status.' },
    { id: 'twentyfive', name: '25 km total', emoji: '🚀', desc: 'You’re a runner now.' },
    { id: 'fifty', name: '50 km total', emoji: '🏆', desc: 'Fifty kilometres. Casual.' }
  ];

  const REMINDER_LINES = [
    'sip sip hooray 💧', 'hydration station, baby 🚰', 'your water bottle misses you 💗',
    'tiny sip, tiny win ✨', 'water break, main character 🎬', 'be kind to your kidneys 💧'
  ];

  return { PROTEIN, FIBER, MEALS, SWAPS, WORKOUTS, RUN_PLAN, QUOTES, TREAT_IDEAS, GROCERY, BADGES, REMINDER_LINES };
})();
