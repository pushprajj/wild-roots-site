/* Wild Roots International — product catalogue: render, search and filter */
(function () {
  'use strict';

  var IMG = {
    spices: { src: 'assets/img/spices.jpg', alt: 'Bowls of ground Indian spices and cinnamon' },
    chilli: { src: 'assets/img/chilli.jpg', alt: 'Dried red chillies in sacks' },
    rice: { src: 'assets/img/rice.jpg', alt: 'Raw long-grain rice' },
    sugar: { src: 'assets/img/sugar.jpg', alt: 'Freshly cut sugarcane' },
    oils: { src: 'assets/img/oils.jpg', alt: 'Coconut oil with split coconuts' },
    onion: { src: 'assets/img/onion.jpg', alt: 'Fresh red onions in bulk' },
    produce: { src: 'assets/img/produce.jpg', alt: 'Fresh tomatoes and lemons' },
    fruit: { src: 'assets/img/fruit.jpg', alt: 'Ripe pomegranates' },
    coconut: { src: 'assets/img/coconut.jpg', alt: 'Fresh tender coconuts' },
    timber: { src: 'assets/img/timber.jpg', alt: 'Hardwood logs at a timber yard' },
    coffee: { src: 'assets/img/coffee.jpg', alt: 'Roasted coffee beans' },
    drinks: { src: 'assets/img/drinks.jpg', alt: 'Colourful bottled juices' },
    frozen: { src: 'assets/img/frozen.jpg', alt: 'Fresh prawns on ice' },
    disposables: { src: 'assets/img/disposables.jpg', alt: 'Kraft paper cups and box' },
    tools: { src: 'assets/img/tools.jpg', alt: 'Carpentry hand tools' },
    paddy: { src: 'assets/img/paddy.jpg', alt: 'Green paddy field' }
  };

  var CATALOG = [
    { id: 'spices', group: 'Spices', name: 'Spices', img: 'spices', blurb: 'Authentic Indian spices sourced directly from farmers and processors.', tags: ['Black Pepper', 'Cardamom', 'Turmeric', 'Cumin', 'Coriander', 'Mustard', 'Fennel', 'Fenugreek', 'Ajwain', 'Cinnamon / Cassia', 'Cloves', 'Asafoetida', 'Ginger & Garlic', 'Chilli Powder', 'Kasuri Methi', 'Garam Masala'] },
    { id: 'chilli', group: 'Spices', name: 'Red Chilli (Dried)', img: 'chilli', blurb: 'All major varieties of dried red chilli, known for their colour, flavour and heat.', tags: ['All major varieties', 'Whole dried', 'Chilli Powder'] },
    { id: 'basmati', group: 'Grains & Staples', name: 'Basmati Rice', img: 'rice', blurb: 'Every commercial grade and finish of Indian basmati — steam, sella, golden sella, white sella and raw.', tags: ['1121', '1509', '1401', '1718', 'Pusa', 'Traditional', 'Steam', 'Sella', 'Golden Sella', 'White Sella', 'Raw'],
      varieties: [
        { label: '1121', items: ['Steam', 'Sella', 'White Sella', 'Golden Sella', 'Pure / Raw'] },
        { label: '1509', items: ['Steam', 'Sella', 'White Sella', 'Golden Sella'] },
        { label: '1401', items: ['Steam', 'Pure / Raw', 'Seed Quality'] },
        { label: '1718', items: ['Steam', 'White Sella', 'Golden Sella'] },
        { label: 'Pusa', items: ['Sella', 'Golden Sella', 'Brown'] },
        { label: 'Traditional', items: ['White Basmati'] }
      ] },
    { id: 'nonbas', group: 'Grains & Staples', name: 'Non-Basmati Rice', img: 'paddy', blurb: 'Parboiled, steam, raw and regional speciality rice from every growing belt in India.', tags: ['IR 64', 'PR 11', 'Sugandha', 'Swarna', 'Sona Masoori', 'Ponni', 'Jeerakashala', 'Palakkadan Matta', 'Vinay RNR', 'Sarbati', 'Round Grain', 'Brown Rice', 'Broken Rice'],
      varieties: [
        { label: 'Parboiled / Sella', items: ['PR 11 Sella', 'IR 64 Sella', 'Sugandha Sella', 'IR 64 Ratna Boil', 'IR 64 Swarna Boil', 'Swarna Boil', 'Vinay RNR Boil', '4049 Boil', 'Kuruva Double Boiled'] },
        { label: 'Steam', items: ['PR 11 Steam', 'Sugandha Steam', 'Sarbati Steam', 'Vinay RNR Steam'] },
        { label: 'Raw', items: ['IR 64 Raw', 'Swarna Raw', 'Sampa Raw', 'Sampa Masoori', 'Vinay RNR Raw'] },
        { label: 'Kerala & South', items: ['Jeerakashala', 'Jeerakashala Gobindgobh', 'Palakkadan Matta', 'Matta Unda', 'Matta Green / Vadi', 'Ponni Golden'] },
        { label: 'Other varieties', items: ['Indian Round Grain', 'Quick Cooking Brown', 'Laghu', 'Lalat', 'Minikit', 'Sanam', 'Banskati', 'Guttu Sammars'] },
        { label: 'Broken', items: ['Matta 100% Broken', 'Vinay RNR Steam Broken', 'Guttu Sammars Broken'] }
      ] },
    { id: 'sugar', group: 'Grains & Staples', name: 'Sugar', img: 'sugar', blurb: 'Refined, raw and powdered sugars in ISS grades, sourced mill-direct.', tags: ['White Crystal', 'Raw Brown', 'Breakfast', 'Caster', 'Icing', 'Sulphurless', 'ISS grade', 'HSN 1701'],
      varieties: [
        { label: 'Crystal', items: ['White crystal, double refined sulphurless (M-31)', 'White crystal, double filter (S-30)'] },
        { label: 'Powdered', items: ['Breakfast sugar, pharmaceutical grade 20–80 mesh (SS-31)', 'Caster sugar, 30–80 mesh (SS-31)', 'Icing sugar, pulverised (SS-31)'] },
        { label: 'Raw', items: ['Brown raw sugar / desi khand, sulphurless'] }
      ] },
    { id: 'oils', group: 'Grains & Staples', name: 'Cooking Oils', img: 'oils', blurb: 'A comprehensive range of edible oils for every cuisine and commercial need.', tags: ['Sunflower', 'Corn', 'Coconut', 'Rice Bran'] },
    { id: 'onion', group: 'Fresh Produce', name: 'Onion & Onion Products', img: 'onion', blurb: 'Fresh and processed varieties sourced directly from the farms.', tags: ['Fresh (wet)', 'Powder — pink & white', 'Flakes — pink & white', 'Chopped — white', 'Granules — white'] },
    { id: 'veg', group: 'Fresh Produce', name: 'Vegetables', img: 'produce', blurb: 'Fresh, naturally grown produce from trusted farms.', tags: ['Tomato', 'Potato', 'Green Chilli', 'Lemon'] },
    { id: 'fruit', group: 'Fresh Produce', name: 'Fruits', img: 'fruit', blurb: "Seasonal fruit from India's fertile growing regions.", tags: ['Pomegranate', 'Banana', 'Mango (seasonal varieties)'] },
    { id: 'coco', group: 'Fresh Produce', name: 'Coconut', img: 'coconut', blurb: 'Whole, dried and processed coconut in export packing.', tags: ['Tender Coconut', 'Fresh Coconut', 'Copra', 'Coconut Powder', 'Coconut Oil'] },
    { id: 'timber', group: 'Timber', name: 'Timber', img: 'timber', blurb: 'Premium-grade timber from sustainable forests, ensuring durability and authenticity.', tags: ['Teak Round Logs — all sizes', 'CNC-made Teak Doors', 'Teak Door Frames', 'Teak Flooring — supply & apply', 'Silver Oak Logs'] },
    { id: 'tea', group: 'Beverages & FMCG', name: 'Tea & Coffee', img: 'coffee', blurb: 'Ten-plus premium grades of tea from India\'s renowned plantations, plus coffee beans and powder — all sourced directly from certified farms.', tags: ['Tea Dust', 'Coffee Beans', 'Coffee Powder'] },
    { id: 'soft', group: 'Beverages & FMCG', name: 'Soft Drinks', img: 'drinks', blurb: 'A complete beverage selection for retail and distribution channels.', tags: ['Energy Drinks', 'Jeera / Lime / Ginger / Masala Soda', 'Cola', 'Fruit Juices (all types)'] },
    { id: 'frozen', group: 'Beverages & FMCG', name: 'Frozen & Ready to Cook', img: 'frozen', blurb: 'Frozen protein and ready-to-cook lines for retail and food service.', tags: ['Chicken', 'Ready-to-cook Chicken', 'Mutton', 'Fish', 'Prawns'] },
    { id: 'disp', group: 'Beverages & FMCG', name: 'Disposables', img: 'disposables', blurb: 'High-quality, food-grade, eco-friendly disposables for restaurants, catering and packaging businesses.', tags: ['Food Packing Containers', 'Plates & Bowls', 'Cutlery, Spoons & Forks', 'Glasses', 'Burger Boxes', 'Corrugated Food Boxes'] },
    { id: 'tools', group: 'Beverages & FMCG', name: 'Construction Tools', img: 'tools', blurb: 'Construction tools supplied to order through our verified supplier network.', tags: ['Supplied to order'] }
  ];

  var GROUPS = ['All', 'Spices', 'Grains & Staples', 'Fresh Produce', 'Timber', 'Beverages & FMCG'];
  var ACCENTS = { 'Spices': '#00963f', 'Grains & Staples': '#00963f', 'Fresh Produce': '#00963f', 'Timber': '#00963f', 'Beverages & FMCG': '#00963f' };

  var grid = document.getElementById('catalog-grid');
  var chipsWrap = document.getElementById('catalog-chips');
  var searchInput = document.getElementById('catalog-search');
  var clearBtn = document.getElementById('catalog-clear');
  var countEl = document.getElementById('catalog-count');
  var emptyEl = document.getElementById('catalog-empty');
  if (!grid) return;

  var state = { group: 'All', query: '' };

  function cardHTML(c) {
    var img = IMG[c.img];
    var tags = c.tags.map(function (t) { return '<li>' + t + '</li>'; }).join('');
    var varieties = '';
    if (c.varieties) {
      var total = c.varieties.reduce(function (n, v) { return n + v.items.length; }, 0);
      var list = '<dl class="pcard__varieties">' + c.varieties.map(function (v) {
        return '<div><dt>' + v.label + '</dt><dd>' + v.items.join(' · ') + '</dd></div>';
      }).join('') + '</dl>';
      varieties = total > 8
        ? '<details class="pcard__more"><summary>' + total + ' varieties — view all</summary>' + list + '</details>'
        : list;
    }
    return (
      '<article class="pcard">' +
        '<div class="cover"><img src="' + img.src + '" alt="' + img.alt + '" loading="lazy"></div>' +
        '<div class="pcard__body">' +
          '<span class="pcard__group" style="color:' + (ACCENTS[c.group] || '#00963f') + '">' + c.group + '</span>' +
          '<h3>' + c.name + '</h3>' +
          '<p class="pcard__blurb">' + c.blurb + '</p>' +
          varieties +
          '<ul class="pcard__tags">' + tags + '</ul>' +
        '</div>' +
      '</article>'
    );
  }

  function render() {
    var q = state.query.trim().toLowerCase();
    var list = CATALOG.filter(function (c) {
      var inGroup = state.group === 'All' || c.group === state.group;
      var extra = c.varieties ? c.varieties.reduce(function (a, v) { return a.concat([v.label], v.items); }, []) : [];
      var matches = !q || [c.name, c.group].concat(c.tags, extra).some(function (t) {
        return String(t).toLowerCase().indexOf(q) !== -1;
      });
      return inGroup && matches;
    });

    grid.innerHTML = list.map(cardHTML).join('');
    if (q) grid.querySelectorAll('.pcard__more').forEach(function (d) { d.open = true; });
    countEl.textContent = list.length + (list.length === 1 ? ' result' : ' results');
    emptyEl.hidden = list.length !== 0;
    clearBtn.hidden = !state.query;

    chipsWrap.querySelectorAll('.chip').forEach(function (chip) {
      chip.setAttribute('aria-pressed', chip.dataset.group === state.group ? 'true' : 'false');
    });
  }

  GROUPS.forEach(function (g) {
    var chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip';
    chip.dataset.group = g;
    chip.textContent = g;
    chip.addEventListener('click', function () {
      state.group = g;
      render();
    });
    chipsWrap.appendChild(chip);
  });

  searchInput.addEventListener('input', function () {
    state.query = searchInput.value;
    render();
  });

  clearBtn.addEventListener('click', function () {
    state.query = '';
    searchInput.value = '';
    searchInput.focus();
    render();
  });

  render();
})();
