import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Dọn dẹp dữ liệu cũ
  await prisma.contactRequest.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.blogPost.deleteMany({});
  await prisma.homepageSlide.deleteMany({});

  console.log('--- Đang bắt đầu quá trình Seed dữ liệu tổng thể ---');

  // ==========================================
  // 2. DỊCH VỤ SÀN GỖ LAMINATE (CÔNG NGHIỆP)
  // ==========================================
  const serviceLaminate = await prisma.service.create({
    data: {
      name: 'Thi công sàn gỗ Laminate',
      slug: 'thi-cong-san-go-laminate',
      description:
        'Sàn gỗ Laminate là giải pháp tối ưu cho không gian sống hiện đại: giữ trọn vẻ đẹp vân gỗ tự nhiên và được nâng cấp bởi công nghệ bề mặt siêu bền. Với tiêu chuẩn chống trầy xước AC4/AC5, khả năng chịu va đập tốt và hệ thống hèm khóa thông minh giúp lắp đặt nhanh gọn, dòng sàn này mang lại thẩm mỹ bền đẹp và cực kỳ dễ vệ sinh, bảo trì. Plantino còn có nhiều bộ sưu tập từ phong cách cổ điển Châu Âu đến các tông gỗ mộc mạc, phù hợp đa dạng nhu cầu sử dụng.',
      imageUrl: 'https://cdn.shopify.com/s/files/1/0789/0940/7543/files/Plantino_Laminate_-_NEXIS_Karumba_Oak_WEB.png',
      isActive: true,
    },
  });

  const laminateProducts = [
    {
      name: 'Plantino Laminate Nexis',
      slug: 'plantino-laminate-nexis',
      description: 'Nexis là bộ sưu tập đầy cảm hứng với sự kết hợp giữa các loài gỗ bản địa Úc tuyệt đẹp và các tông màu Sồi (Oak) đang dẫn đầu xu hướng toàn cầu. Bề mặt ván được xử lý tinh xảo để tái hiện chân thực từng thớ gỗ, mang đến vẻ đẹp hiện đại và sang trọng cho mọi căn hộ.',
      imageUrl: 'https://cdn.shopify.com/s/files/1/0789/0940/7543/files/Plantino_Laminate_-_NEXIS_Karumba_Oak_WEB.png',
      variants: [
        { name: 'Albany Spotted Gum', url: 'https://res.cloudinary.com/choices-flooring/image/upload/v1729121924/Plantino_Laminate_Nexis_Albany_Spotted_Gum.webp' },
        { name: 'Healesville Spotted Gum', url: 'https://res.cloudinary.com/choices-flooring/image/upload/v1729121925/Plantino_Laminate_Nexis_Healesville_Spotted_Gum.webp' },
        { name: 'Hervey Oak', url: 'https://res.cloudinary.com/choices-flooring/image/upload/v1729121926/Plantino_Laminate_Nexis_Hervey_Oak.webp' },
        { name: 'Karumba Oak', url: 'https://res.cloudinary.com/choices-flooring/image/upload/v1729121927/Plantino_Laminate_Nexis_Karumba_Oak.webp' },
        { name: 'Wollombi Oak', url: 'https://res.cloudinary.com/choices-flooring/image/upload/v1729121924/Plantino_Laminate_Nexis_Wollombi_Oak.webp' }
      ]
    },
    {
      name: 'Plantino Laminate Manor',
      slug: 'plantino-laminate-manor',
      description: 'Dòng sản phẩm Manor định nghĩa lại sự bề thế với các tấm ván kích thước dài và rộng đặc trưng của Châu Âu. Manor sử dụng hệ thống hèm khóa Uniclic độc quyền và có chế độ bảo hành hư hỏng do nước, đảm bảo sự yên tâm tuyệt đối trong suốt quá trình sử dụng.',
      imageUrl: 'https://cdn.shopify.com/s/files/1/0789/0940/7543/files/PlantinoLaminate_-_Manor_Coffee_Oak_swatch_WEB.jpg',
      variants: [
        { name: 'Coffee Oak', url: 'https://res.cloudinary.com/choices-flooring/image/upload/v1700520990/2019%20Website%20Images/Hard%20Flooring/Laminate/Plantino_Laminate_-_Manor_Coffee_Oak_swatch_WEB.jpg' },
        { name: 'Dune Oak', url: 'https://res.cloudinary.com/choices-flooring/image/upload/v1700520991/2019%20Website%20Images/Hard%20Flooring/Laminate/Plantino_Laminate_-_Manor_Dune_Oak_swatch_WEB.jpg' },
        { name: 'Grey Dusky Oak', url: 'https://res.cloudinary.com/choices-flooring/image/upload/v1700520991/2019%20Website%20Images/Hard%20Flooring/Laminate/Plantino_Laminate_-_Manor_Grey_Dusk_Oak_swatch_WEB.jpg' }
      ]
    },
    {
      name: 'Plantino Laminate Esprit',
      slug: 'plantino-laminate-esprit',
      description: 'Esprit mang lại vẻ đẹp rực rỡ và sang trọng vượt trội. Được lấy cảm hứng từ thế giới tự nhiên, mỗi màu sắc trong dòng Esprit đều được chăm chút để tạo nên một không gian sống đầy phong cách, bền bỉ và dễ dàng vệ sinh.',
      imageUrl: 'https://cdn.shopify.com/s/files/1/0789/0940/7543/files/Plantino_Esprit_Ardennes_Oak_WEB.jpg',
      variants: [
        { name: 'Chaumet Oak', url: 'https://res.cloudinary.com/choices-flooring/image/upload/v1726805761/2019%20Website%20Images/Hard%20Flooring/Laminate/Plantino_Esprit_Chaumet_Oak_WEB.jpg' },
        { name: 'Ardennes Oak', url: 'https://res.cloudinary.com/choices-flooring/image/upload/v1726806457/2019%20Website%20Images/Hard%20Flooring/Laminate/Plantino_Esprit_Ardennes_Oak_WEB.jpg' },
        { name: 'Darney Spotted Gum', url: 'https://res.cloudinary.com/choices-flooring/image/upload/v1726806590/2019%20Website%20Images/Hard%20Flooring/Laminate/Plantino_Esprit_Darney_Spotted_Gum_WEB.jpg' }
      ]
    },
    {
      name: 'Plantino Laminate Eaton',
      slug: 'plantino-laminate-eaton',
      description: 'Eaton kết hợp sự linh hoạt của phong cách và sức mạnh của lõi gỗ bền bỉ. Với nhiều thiết kế được tuyển chọn kỹ lưỡng, Eaton mời gọi bạn đắm mình vào vẻ đẹp thanh bình của tự nhiên ngay trong chính ngôi nhà của mình.',
      imageUrl: 'https://cdn.shopify.com/s/files/1/0789/0940/7543/files/EATON010RibbonwoodOak.jpg',
      variants: [
        { name: 'Ribbonwood Oak', url: 'https://res.cloudinary.com/choices-flooring/image/upload/v1726714542/2019%20Website%20Images/Hard%20Flooring/Laminate/EATON010_Ribbonwood_Oak.jpg' },
        { name: 'Satinash Spotted Gum', url: 'https://res.cloudinary.com/choices-flooring/image/upload/v1726714774/2019%20Website%20Images/Hard%20Flooring/Laminate/EATON020_Satinash_Spotted_Gum.jpg' }
      ]
    },
    {
      name: 'Plantino Laminate Barrett',
      slug: 'plantino-laminate-barrett',
      description: 'Barrett mang đến vẻ ngoài giống gỗ tự nhiên đến kinh ngạc. Được thiết kế cho cuộc sống gia đình năng động, dòng Barrett cân bằng giữa yếu tố thẩm mỹ hiện đại và khả năng chịu lực vượt trội cho các khu vực mật độ đi lại cao.',
      imageUrl: 'https://cdn.shopify.com/s/files/1/0789/0940/7543/files/Plantino_Laminate_Barrett_Coastline_Blackbutt.jpg',
      variants: [
        { name: 'Richlands Spotted Gum', url: 'https://res.cloudinary.com/choices-flooring/image/upload/v1742423087/2024-Updated-Website-Images/Hard%20Flooring/Plantino%20Laminate%20Barrett/Plantino_Laminate_Barrett_Richlands_Spotted_Gum.webp' },
        { name: 'Coastline Blackbutt', url: 'https://res.cloudinary.com/choices-flooring/image/upload/v1742423089/2024-Updated-Website-Images/Hard%20Flooring/Plantino%20Laminate%20Barrett/Plantino_Laminate_Barrett_Coastline_Blackbutt.webp' }
      ]
    },
    {
      name: 'Plantino Laminate Renova',
      slug: 'plantino-laminate-renova',
      description: 'Renova là minh chứng cho dòng sàn gỗ trường tồn với thời gian. Ngay cả trong những hộ gia đình bận rộn nhất, Renova vẫn giữ được vẻ đẹp nguyên bản nhờ công nghệ bảo vệ bề mặt tiên tiến và các thiết kế gỗ hiện đại.',
      imageUrl: 'https://cdn.shopify.com/s/files/1/0789/0940/7543/files/Plantino_Laminate_Renova_Buttermilk_Oak_WEB.jpg',
      variants: [
        { name: 'Golden Ember Oak', url: 'https://res.cloudinary.com/choices-flooring/image/upload/v1760409813/2019%20Website%20Images/Hard%20Flooring/Laminate/Plantino_Laminate_Renova_Golden_Ember_Oak_WEB.jpg' },
        { name: 'Buttermilk Oak', url: 'https://res.cloudinary.com/choices-flooring/image/upload/v1760409811/2019%20Website%20Images/Hard%20Flooring/Laminate/Plantino_Laminate_Renova_Buttermilk_Oak_WEB.jpg' }
      ]
    }
  ];

  // ==========================================
  // 3. DỊCH VỤ SÀN GỖ HYBRID (RIGID)
  // ==========================================
  const serviceHybrid = await prisma.service.create({
    data: {
      name: 'Thi công sàn gỗ Hybrid',
      slug: 'thi-cong-san-go-hybrid',
      description: 'Sàn gỗ Hybrid (Rigid) là dòng vật liệu thế hệ mới, sở hữu ưu điểm vượt trội của cả sàn nhựa và sàn gỗ công nghiệp. Với cấu tạo lõi cứng siêu chắc chắn, dòng sàn này có khả năng chống nước 100%, không co ngót hay giãn nở trước sự thay đổi nhiệt độ đột ngột. Abode Hybrid là lựa chọn số 1 cho các không gian cần sự bền bỉ tuyệt đối như phòng bếp, khu vực sảnh hoặc những gia đình có vật nuôi.',
      imageUrl: 'https://cdn.shopify.com/s/files/1/0789/0940/7543/files/Abode_Alpha_-_Bunyip_Black_Butt_swatch_WEB.jpg',
      isActive: true,
    },
  });

  const hybridProducts = [
    {
      name: 'Abode Alpha',
      slug: 'abode-alpha',
      description: 'Abode Alpha thiết lập chuẩn mực mới về sự cân bằng giữa chi phí và chất lượng. Với dải màu đa dạng và khả năng chịu lực bền bỉ, Alpha là người bạn đồng hành hoàn hảo cho mọi công trình dân dụng.',
      imageUrl: 'https://cdn.shopify.com/s/files/1/0789/0940/7543/files/Abode_Alpha_-_Bunyip_Black_Butt_swatch_WEB.jpg',
      variants: [
        { name: 'Bunyip Blackbutt', url: 'https://res.cloudinary.com/choices-flooring/image/upload/v1688606733/2019%20Website%20Images/Hard%20Flooring/Rigid/Abode_Alpha_-_Bunyip_Black_Butt_swatch_WEB.jpg' },
        { name: 'Caldwell Oak', url: 'https://res.cloudinary.com/choices-flooring/image/upload/2019%20Website%20Images/Hard%20Flooring/Rigid/Abode_Alpha_-_Caldwell_Oak_swatch_WEB.jpg' }
      ]
    },
    {
      name: 'Abode Avenue',
      slug: 'abode-avenue',
      description: 'Dòng Avenue mang đến sức mạnh và sự ổn định đặc biệt. Các hoa văn nổi bật mô phỏng tinh túy của gỗ tự nhiên giúp không gian trở nên sống động và đẳng cấp hơn.',
      imageUrl: 'https://cdn.shopify.com/s/files/1/0789/0940/7543/files/Abode_Avenue_-_Aldan_Oak_WEB.jpg',
      variants: [
        { name: 'Aldan Oak', url: 'https://res.cloudinary.com/choices-flooring/image/upload/v1686186134/2019%20Website%20Images/Hard%20Flooring/Rigid/Abode_Avenue_-_Aldan_Oak_WEB.jpg' },
        { name: 'Murray Spotted Gum', url: 'https://res.cloudinary.com/choices-flooring/image/upload/v1686186135/2019%20Website%20Images/Hard%20Flooring/Rigid/Abode_Avenue_-_Murray_Spotted_Gum_WEB.jpg' }
      ]
    },
    {
      name: 'Abode Elevate',
      slug: 'abode-elevate',
      description: 'Elevate là dòng Hybrid công nghệ cao, cung cấp khả năng kháng nước tuyệt đối và thiết kế tinh mỹ, phù hợp cho những yêu cầu thi công khắt khe nhất.',
      imageUrl: 'https://cdn.shopify.com/s/files/1/0789/0940/7543/files/Abode_Elevate_-_Blackbutt_swatch_WEB.jpg',
      variants: [
        { name: 'Blackbutt', url: 'https://res.cloudinary.com/choices-flooring/image/upload/v1643936899/2019%20Website%20Images/Hard%20Flooring/Rigid/Abode_Elevate_-_Blackbutt_swatch_WEB.jpg' },
        { name: 'Pearl Oak', url: 'https://res.cloudinary.com/choices-flooring/image/upload/v1643936899/2019%20Website%20Images/Hard%20Flooring/Rigid/Abode_Elevate_-_Pearl_Oak_swatch_WEB.jpg' }
      ]
    },
    {
      name: 'Abode Vibe',
      slug: 'abode-vibe',
      description: 'Vibe dẫn đầu với những thiết kế trẻ trung, bắt kịp xu hướng. Công nghệ lõi vượt trội giúp sản phẩm dễ dàng lắp đặt và duy trì độ bền trọn đời.',
      imageUrl: 'https://cdn.shopify.com/s/files/1/0789/0940/7543/files/Abode_Vibe_-_Antique_Brushed_Oak_WEB_dcbf7691-febd-4a08-b4c0-9c06792df882.jpg',
      variants: [
        { name: 'Classic Blackbutt', url: 'https://res.cloudinary.com/choices-flooring/image/upload/v1701991901/2019%20Website%20Images/Hard%20Flooring/Rigid/Abode_Vibe_-_Classic_Blackbutt_WEB.jpg' },
        { name: 'Timeless Oak', url: 'https://res.cloudinary.com/choices-flooring/image/upload/v1701991904/2019%20Website%20Images/Hard%20Flooring/Rigid/Abode_Vibe_-_Timeless_Oak_WEB.jpg' }
      ]
    },
    {
      name: 'Abode Whispers',
      slug: 'abode-whispers',
      description: 'Đỉnh cao của sự êm ái với lớp phủ "soft-touch". Abode Whispers biến không gian nhà bạn thành nơi thư giãn lý tưởng với mỗi bước chân mềm mại như tơ.',
      imageUrl: 'https://cdn.shopify.com/s/files/1/0789/0940/7543/files/Abode_Whispers_-_Pearl_Oak_WEB.jpg',
      variants: [
        { name: 'Pearl Oak', url: 'https://res.cloudinary.com/choices-flooring/image/upload/v1719974148/2019%20Website%20Images/Hard%20Flooring/Rigid/Abode_Whispers_-_Pearl_Oak_WEB.jpg' },
        { name: 'Mineral Oak', url: 'https://res.cloudinary.com/choices-flooring/image/upload/v1719974149/2019%20Website%20Images/Hard%20Flooring/Rigid/Abode_Whispers_-_Mineral_Oak_WEB.jpg' },
        { name: 'Sweet Walnut', url: 'https://res.cloudinary.com/choices-flooring/image/upload/v1719974148/2019%20Website%20Images/Hard%20Flooring/Rigid/Abode_Whispers_-_Sweet_Walnut_WEB.jpg' }
      ]
    }
  ];

  // ==========================================
  // 4. LOGIC SEED DỮ LIỆU TỰ ĐỘNG
  // ==========================================

  async function seedCategory(products: any[], serviceId: string) {
    for (const p of products) {
      const createdProduct = await prisma.product.create({
        data: {
          serviceId: serviceId,
          name: p.name,
          slug: p.slug,
          description: p.description,
          imageUrl: p.imageUrl,
          isActive: true,
        }
      });

      for (const v of p.variants) {
        await prisma.productVariant.create({
          data: {
            productId: createdProduct.id,
            name: v.name,
            imageUrl: v.url,
            isActive: true,
          }
        });
      }
    }
  }

  await seedCategory(laminateProducts, serviceLaminate.id);
  await seedCategory(hybridProducts, serviceHybrid.id);

  // ==========================================
  // 5. SEED DỰ ÁN ĐÃ HOÀN THÀNH (PROJECTS)
  // ==========================================
  console.log('--- Đang Seed dữ liệu dự án mẫu (Phong cách Úc) ---');

  const projects = [
    {
      title: 'The Harbourview Apartment - Sydney Harbour',
      slug: 'the-harbourview-apartment-sydney-harbour',
      serviceId: serviceLaminate.id,
      description:
        'Dự án cải tạo căn hộ cao cấp hướng vịnh Sydney. Với yêu cầu về sự sang trọng và khả năng chịu được khí hậu ven biển, dòng sàn Plantino Laminate Manor khổ lớn đã được lựa chọn. Màu sắc vân gỗ sồi tự nhiên hòa hợp hoàn hảo với thiết kế nội thất hiện đại, tạo nên một không gian sống đẳng cấp bậc nhất tại khu vực The Rocks.',
      roomDetails: 'Penthouse: 1 Living room, 3 Bedrooms, 1 Home Office',
      totalAreaM2: 215.5,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/choices-flooring/image/upload/v1726805960/2019%20Website%20Images/Hard%20Flooring/Laminate/Esprit_ChaumetOak_lifestyle_WEB.jpg',
          caption: 'Living area with premium wide-board laminate',
        },
        {
          imageUrl:
            'https://res.cloudinary.com/choices-flooring/image/upload/v1726806143/2019%20Website%20Images/Hard%20Flooring/Laminate/Esprit_ChaumetOak_LS_WEB.jpg',
          caption: 'Natural oak texture under morning sunlight',
        },
      ],
    },
    {
      title: 'Modern Suburban Villa - Melbourne Bayside',
      slug: 'modern-suburban-villa-melbourne-bayside',
      serviceId: serviceHybrid.id,
      description:
        'Thi công sàn gỗ cho biệt thự gia đình tại vùng ngoại ô Melbourne. Gia chủ cần giải pháp sàn chống nước tuyệt đối cho khu vực bếp mở và phòng khách rộng. Abode Alpha Hybrid với cốt lõi Rigid Core đã giải quyết hoàn toàn nỗi lo về độ ẩm và trầy xước, mang lại vẻ đẹp đồng nhất cho toàn bộ mặt sàn tầng trệt.',
      roomDetails: 'Family Villa: Open Kitchen, Dining Room, Kids Playroom',
      totalAreaM2: 165.0,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/choices-flooring/image/upload/v1607042099/2019%20Website%20Images/Hard%20Flooring/Rigid/Abode_Alpha_Tarkine_Oak_lifestyle_web.jpg',
          caption: 'Waterproof Hybrid flooring for open-plan living',
        },
      ],
    },
    {
      title: 'Serene Coastal Retreat - Gold Coast QLD',
      slug: 'serene-coastal-retreat-gold-coast-qld',
      serviceId: serviceHybrid.id,
      description:
        'Một dự án nghỉ dưỡng ven biển tại bang Queensland. Ưu tiên hàng đầu là cảm giác êm ái và giảm tiếng ồn. Chúng tôi đã sử dụng dòng Abode Whispers với công nghệ lớp phủ Soft-touch, giúp bước chân trần luôn cảm thấy ấm áp và thư giãn, loại bỏ tiếng lọc cọc đặc trưng của các dòng sàn cũ.',
      roomDetails: 'Vacation Home: 4 Master Suites, 1 Study room',
      totalAreaM2: 140.0,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/choices-flooring/image/upload/v1705113368/Lifestyle%20Images/ROOMS/HOME%20OFFICE/Choices_9Oct20234034.jpg',
          caption: 'Soft-touch Hybrid flooring for a quiet bedroom experience',
        },
      ],
    },
  ];

  for (const proj of projects) {
    await prisma.project.create({
      data: {
        title: proj.title,
        slug: proj.slug,
        serviceId: proj.serviceId,
        description: proj.description,
        roomDetails: proj.roomDetails,
        totalAreaM2: proj.totalAreaM2,
        isActive: true,
        images: {
          create: proj.images.map((img) => ({
            imageUrl: img.imageUrl,
            caption: img.caption,
          })),
        },
      },
    });
  }

  // ==========================================
  // 6. THÊM 3 DỰ ÁN (TIẾP THEO)
  // ==========================================
  console.log('--- Đang Seed thêm 3 dự án: Brisbane, Adelaide, Perth ---');

  const moreProjects = [
    {
      title: 'Commercial Office Suite - Brisbane CBD',
      slug: 'commercial-office-suite-brisbane-cbd',
      serviceId: serviceLaminate.id, // Dùng sàn Laminate Nexis
      description:
        'Dự án cải tạo văn phòng làm việc hiện đại tại trung tâm tài chính Brisbane. Với mật độ đi lại cao và sử dụng ghế xoay thường xuyên, dòng sàn Plantino Laminate Nexis với tiêu chuẩn AC5 đã được lựa chọn. Sàn gỗ không chỉ mang lại vẻ chuyên nghiệp, ấm cúng hơn so với thảm văn phòng truyền thống mà còn cực kỳ dễ bảo trì và chống trầy xước từ chân ghế kim loại.',
      roomDetails: 'Reception Area, Open Workspace, 2 Meeting Rooms',
      totalAreaM2: 320.0,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/choices-flooring/image/upload/v1726807082/2019%20Website%20Images/Hard%20Flooring/Laminate/Esprit_VallonsOak_lifestyle_WEB.jpg',
          caption: 'Professional workspace with durable Nexis laminate',
        },
      ],
    },
    {
      title: 'The Urban Studio - Adelaide Arts District',
      slug: 'the-urban-studio-adelaide-arts-district',
      serviceId: serviceHybrid.id, // Dùng sàn Hybrid Elevate
      description:
        'Một căn hộ Studio mang phong cách Industrial tại khu nghệ thuật Adelaide. Chúng tôi đã sử dụng dòng Abode Elevate Hybrid để đáp ứng yêu cầu về độ bền và tính thẩm mỹ của gia chủ. Cốt lõi cứng giúp sàn ổn định tuyệt đối dù căn hộ có hệ thống cửa kính lớn tiếp xúc trực tiếp với ánh nắng mặt trời gay gắt tại Nam Úc.',
      roomDetails: 'Open-plan Studio, Kitchenette, Creative Workshop',
      totalAreaM2: 75.0,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/choices-flooring/image/upload/v1643936900/2019%20Website%20Images/Hard%20Flooring/Rigid/Abode_Elevate_-_Spotted_Gum_swatch_WEB.jpg',
          caption: 'Stylish Hybrid flooring for compact urban living',
        },
      ],
    },
    {
      title: 'Heritage Manor Restoration - Perth Hills',
      slug: 'heritage-manor-restoration-perth-hills',
      serviceId: serviceLaminate.id, // Dùng sàn Laminate Esprit
      description:
        'Dự án phục chế một ngôi nhà di sản tại Perth Hills. Gia chủ muốn giữ lại nét cổ điển nhưng yêu cầu vật liệu hiện đại để dễ chăm sóc. Dòng Plantino Laminate Esprit với bề mặt mô phỏng gỗ tự nhiên 3D đã hoàn thành xuất sắc nhiệm vụ này. Những tấm ván dài mang lại chiều sâu và tôn vinh những món đồ nội thất gỗ thủ công của gia đình.',
      roomDetails: 'Formal Dining Room, Library, 5 Bedrooms',
      totalAreaM2: 310.0,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/choices-flooring/image/upload/v1734063562/2019%20Website%20Images/Hard%20Flooring/Rigid/Abode_-_Derwent_Bowen_Spotted_Gum_WEB.jpg',
          caption: 'Elegant heritage restoration with premium laminate',
        },
      ],
    },
  ];

  for (const proj of moreProjects) {
    await prisma.project.create({
      data: {
        title: proj.title,
        slug: proj.slug,
        serviceId: proj.serviceId,
        description: proj.description,
        roomDetails: proj.roomDetails,
        totalAreaM2: proj.totalAreaM2,
        isActive: true,
        images: {
          create: proj.images.map((img) => ({
            imageUrl: img.imageUrl,
            caption: img.caption,
          })),
        },
      },
    });
  }

  // ==========================================
  // 6. SEED BÀI VIẾT BLOG (BLOG POSTS)
  // ==========================================
  console.log('--- Đang Seed dữ liệu bài viết Blog ---');

  const blogPosts = [
    {
      title: 'Tại sao sàn gỗ Hybrid trở thành xu hướng số 1 tại các căn hộ ở Úc?',
      slug: 'tai-sao-san-go-hybrid-tro-thanh-xu-huong-so-1-tai-uc',
      excerpt:
        'Khám phá lý do tại sao dòng sàn Hybrid lại vượt mặt sàn gỗ tự nhiên và sàn nhựa để chiếm lĩnh thị trường nội thất hiện đại.',
      content:
        'Sàn gỗ Hybrid đang tạo nên một cuộc cách mạng tại thị trường Sydney và Melbourne. Kết hợp giữa đặc tính bền bỉ của sàn gạch và vẻ đẹp tinh tế của gỗ sồi, sàn Hybrid (Rigid Core) mang đến khả năng chống nước 100%. Điều này cực kỳ quan trọng với các thiết kế không gian mở (open-plan living) phổ biến tại Úc, nơi phòng khách và nhà bếp thông nhau. Bên cạnh đó, khả năng chịu được sự biến đổi nhiệt độ khắc nghiệt mà không co ngót là ưu điểm khiến các kiến trúc sư luôn ưu tiên lựa chọn dòng sàn này cho các dự án cao cấp.',
      imageUrl:
        'https://res.cloudinary.com/choices-flooring/image/upload/v1643936899/2019%20Website%20Images/Hard%20Flooring/Rigid/Abode_Elevate_-_Blackbutt_swatch_WEB.jpg',
    },
    {
      title: 'So sánh sàn Laminate và sàn Hybrid: Lựa chọn nào phù hợp cho ngôi nhà của bạn?',
      slug: 'so-sanh-san-laminate-va-san-hybrid',
      excerpt:
        'Bạn đang phân vân giữa sàn Laminate và Hybrid? Hãy cùng điểm qua những khác biệt chính về độ bền, khả năng chịu nước và giá thành.',
      content:
        'Lựa chọn giữa Laminate và Hybrid thường phụ thuộc vào ngân sách và khu vực lắp đặt. Sàn Laminate nổi tiếng với khả năng chống trầy xước tuyệt vời (chuẩn AC4-AC5) và cảm giác chân thực như gỗ thật, phù hợp cho phòng ngủ và phòng khách khô ráo. Trong khi đó, sàn Hybrid với lõi cứng SPC lại chiếm ưu thế tuyệt đối ở những nơi ẩm ướt như nhà bếp nhờ tính năng kháng nước 100%. Về giá thành, Laminate thường có mức giá cạnh tranh hơn, trong khi Hybrid là khoản đầu tư dài hạn cho sự bền bỉ.',
      imageUrl:
        'https://res.cloudinary.com/choices-flooring/image/upload/v1729121927/Plantino_Laminate_Nexis_Karumba_Oak.webp',
    },
    {
      title: 'Bí quyết bảo quản sàn gỗ công nghiệp luôn bền đẹp như mới',
      slug: 'bi-quyet-bao-quan-san-go-cong-nghiep',
      excerpt:
        'Hướng dẫn chi tiết cách vệ sinh và bảo dưỡng sàn gỗ để kéo dài tuổi thọ lên đến 25 năm.',
      content:
        'Để sàn gỗ luôn bóng đẹp, quy tắc vàng là tránh để nước đọng quá lâu và không sử dụng hóa chất tẩy rửa mạnh. Hãy sử dụng máy hút bụi đầu mềm hoặc chổi sợi mịn để làm sạch bụi bẩn hàng ngày. Đối với các dòng sàn cao cấp như Plantino, bề mặt đã có lớp bảo vệ chống bám bẩn, vì vậy bạn chỉ cần một chiếc khăn ẩm vắt kiệt nước để lau sạch các vết bẩn cứng đầu. Đừng quên sử dụng các miếng đệm cao su dưới chân đồ nội thất để tránh gây ra các vết lõm không đáng có.',
      imageUrl:
        'https://res.cloudinary.com/choices-flooring/image/upload/v1726807082/2019%20Website%20Images/Hard%20Flooring/Laminate/Esprit_VallonsOak_lifestyle_WEB.jpg',
    },
    {
      title: '5 Tông màu sàn gỗ sồi (Oak) dẫn đầu xu hướng thiết kế năm 2026',
      slug: '5-tong-mau-san-go-soi-dan-dau-xu-huong-2026',
      excerpt:
        'Từ màu xám hiện đại đến tông vàng ấm áp, hãy cùng tìm hiểu những màu sàn đang "làm mưa làm gió" trong giới thiết kế nội thất.',
      content:
        'Năm 2026 đánh dấu sự lên ngôi của các tông màu tự nhiên và trung tính. Đứng đầu danh sách là tông màu "Smokey Oak" với sắc xám nhạt tinh tế, mang lại vẻ hiện đại cho các studio. Tiếp theo là "Natural Oak" cổ điển - màu sắc chưa bao giờ lỗi mốt vì khả năng làm sáng không gian. Các kiến trúc sư tại Brisbane cũng đang ưa chuộng tông màu "Blackbutt" của Úc bởi sự mộc mạc nhưng cực kỳ sang trọng khi kết hợp với nội thất tối giản.',
      imageUrl:
        'https://res.cloudinary.com/choices-flooring/image/upload/v1686186134/2019%20Website%20Images/Hard%20Flooring/Rigid/Abode_Avenue_-_Aldan_Oak_WEB.jpg',
    },
    {
      title: 'Công nghệ Soft-touch trên sàn Hybrid Whispers là gì?',
      slug: 'cong-nghe-soft-touch-tren-san-hybrid-whispers',
      excerpt:
        'Tìm hiểu về lớp phủ đặc biệt giúp sàn gỗ trở nên êm ái và yên tĩnh hơn bao giờ hết.',
      content:
        'Nếu bạn ghét tiếng ồn phát ra mỗi khi di chuyển trên sàn gỗ, công nghệ Soft-touch chính là câu trả lời. Được tích hợp độc quyền trên dòng Abode Whispers, lớp phủ này đóng vai trò như một bộ giảm chấn siêu mỏng, giúp triệt tiêu âm thanh va chạm. Không chỉ dừng lại ở tiếng ồn, Soft-touch còn tạo ra một bề mặt mịn màng, ấm áp, giúp bảo vệ xương khớp cho người già và trẻ nhỏ khi vận động trên sàn nhà trong thời gian dài.',
      imageUrl:
        'https://res.cloudinary.com/choices-flooring/image/upload/v1719974148/2019%20Website%20Images/Hard%20Flooring/Rigid/Abode_Whispers_-_Pearl_Oak_WEB.jpg',
    },
    {
      title: 'Quy trình thi công sàn gỗ chuyên nghiệp theo tiêu chuẩn quốc tế',
      slug: 'quy-trinh-thi-cong-san-go-chuyen-nghiep',
      excerpt:
        'Từ khâu khảo sát mặt sàn đến bước hoàn thiện nẹp chân tường - mọi thứ cần phải chuẩn xác để sàn không bị phồng rộp.',
      content:
        'Một bộ sàn gỗ bền đẹp chỉ khi được lắp đặt đúng kỹ thuật. Quy trình của chúng tôi bắt đầu bằng việc kiểm tra độ phẳng và độ ẩm của mặt nền bê tông. Tiếp theo là lớp lót cao su non chuyên dụng để chống ẩm và giảm chấn. Các tấm ván được lắp ghép tỉ mỉ theo kỹ thuật hèm khóa Uniclic, đảm bảo khoảng cách giãn nở an toàn sát vách tường. Cuối cùng, hệ thống nẹp và phào chân tường được lắp đặt đồng bộ để tạo nên vẻ đẹp hoàn thiện và tinh tế cho toàn bộ căn phòng.',
      imageUrl:
        'https://res.cloudinary.com/choices-flooring/image/upload/v1734063562/2019%20Website%20Images/Hard%20Flooring/Rigid/Abode_-_Derwent_Bowen_Spotted_Gum_WEB.jpg',
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.create({
      data: post,
    });
  }

  // ==========================================
  // 7. SEED HOMEPAGE SLIDES (ADMIN HERO)
  // ==========================================
  console.log('--- Đang Seed dữ liệu homepage slides ---');

  const homepageSlides = [
    {
      title: 'Laminate chống trầy cho không gian hiện đại',
      description:
        'Giải pháp tối ưu cho phòng khách và phòng ngủ với bề mặt dễ vệ sinh, thẩm mỹ vân gỗ sang trọng.',
      imageUrl: 'https://picsum.photos/1600/900?random=101',
      ctaLabel: 'Xem dịch vụ Laminate',
      ctaHref: '/services/thi-cong-san-go-laminate',
      sortOrder: 1,
      isActive: true,
    },
    {
      title: 'Thi công Laminate chuẩn kỹ thuật, đúng tiến độ',
      description:
        'Đội ngũ Floring khảo sát kỹ mặt bằng, thi công đúng quy trình để sàn ổn định và sử dụng lâu dài.',
      imageUrl: 'https://picsum.photos/1600/900?random=102',
      ctaLabel: 'Xem mẫu Laminate',
      ctaHref: '/services/thi-cong-san-go-laminate',
      sortOrder: 2,
      isActive: true,
    },
    {
      title: 'Hybrid chống nước 100% cho khu vực sinh hoạt',
      description:
        'Lý tưởng cho nhà bếp và khu vực đi lại cao nhờ cốt lõi cứng, bề mặt bền bỉ và dễ bảo dưỡng.',
      imageUrl: 'https://picsum.photos/1600/900?random=103',
      ctaLabel: 'Xem dịch vụ Hybrid',
      ctaHref: '/services/thi-cong-san-go-hybrid',
      sortOrder: 3,
      isActive: true,
    },
    {
      title: 'Thi công Hybrid thẩm mỹ cao, bền và êm',
      description:
        'Floring tư vấn màu sàn hài hòa nội thất, đảm bảo cả công năng sử dụng và giá trị thẩm mỹ tổng thể.',
      imageUrl: 'https://picsum.photos/1600/900?random=104',
      ctaLabel: 'Xem mẫu Hybrid',
      ctaHref: '/services/thi-cong-san-go-hybrid',
      sortOrder: 4,
      isActive: true,
    },
  ];

  for (const slide of homepageSlides) {
    await prisma.homepageSlide.create({ data: slide });
  }

  console.info(`--- Đã hoàn thành Seed: ${blogPosts.length} Bài viết Blog chuyên sâu ---`);
  console.info(`--- Đã hoàn thành Seed: ${homepageSlides.length} Homepage slides ---`);

  console.info(
    `--- Seed hoàn tất: 2 Dịch vụ, ${laminateProducts.length + hybridProducts.length} Dòng sản phẩm, + ${projects.length + moreProjects.length
    } Dự án tiêu chuẩn quốc tế (Úc) ---`,
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });