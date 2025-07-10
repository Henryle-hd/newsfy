import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample articles based on Tanzania news themes
const articles = [
  // KIMATAIFA (International)
  {
    title: "Tanzania Participates in Global Giga Connectivity Forum",
    content: "GENEVA, SWITZERLAND: Tanzania has participated in the Global Giga Connectivity Forum, which aims to discuss strategies to enhance teaching and learning through digital connectivity. The forum focused on bridging the digital divide and improving access to quality education through technology. Tanzanian representatives highlighted the country's progress in expanding internet infrastructure and connecting schools to high-speed internet. The participation underscores Tanzania's commitment to digital transformation and educational advancement on the global stage.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
    category: "KIMATAIFA",
    day: "9",
    month: "July",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "Daily News Tanzania"
  },
  {
    title: "SADC Leaders Celebrate Development Milestones",
    content: "President Samia Suluhu Hassan addressed the Southern African Development Community (SADC) fraternity, celebrating significant milestones achieved in regional development and cooperation. The meeting highlighted progress in trade facilitation, infrastructure development, and cross-border initiatives. Tanzania's role in regional integration was emphasized, particularly in energy cooperation and transport corridor development. The President outlined Tanzania's commitment to strengthening SADC partnerships and promoting sustainable development across the region.",
    image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&h=600&fit=crop",
    category: "KIMATAIFA",
    day: "8",
    month: "July",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "The Citizen Tanzania"
  },
  {
    title: "Tanzania-Turkey Partnership Strengthens Economic Ties",
    content: "A high-level delegation from Turkey visited Tanzania to discuss expanding bilateral trade and investment opportunities. The meeting focused on sectors including manufacturing, agriculture, and tourism. Turkish investors expressed interest in Tanzania's growing economy and strategic location in East Africa. Both countries agreed to establish joint working groups to facilitate business partnerships and explore new areas of cooperation. The partnership is expected to create employment opportunities and boost economic growth in both nations.",
    image: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=800&h=600&fit=crop",
    category: "KIMATAIFA",
    day: "7",
    month: "July",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "Daily News Tanzania"
  },
  {
    title: "East African Community Summit Addresses Regional Integration",
    content: "Tanzania participated in the East African Community (EAC) Summit focusing on accelerating regional integration and addressing common challenges. Key discussions centered on harmonizing trade policies, improving transport infrastructure, and strengthening security cooperation. The summit also addressed climate change adaptation and sustainable development goals. Tanzania's President emphasized the importance of unity and cooperation in achieving shared prosperity across the East African region.",
    image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=600&fit=crop",
    category: "KIMATAIFA",
    day: "6",
    month: "July",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "IPP Media"
  },

  // AFYA (Health)
  {
    title: "Tanzania Tackles Road Traffic Deaths with Emergency Care Initiative",
    content: "Dar es Salaam - Tanzania is addressing its critical road traffic death rate of 16 deaths per 100,000 people through improved emergency medical services. The government has launched a comprehensive program to enhance pre-hospital care and trauma management. New ambulance services and emergency response teams are being deployed across major highways. Healthcare workers are receiving specialized training in emergency medicine and trauma care. The initiative aims to significantly reduce preventable deaths and disabilities from road accidents.",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
    category: "AFYA",
    day: "9",
    month: "July",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "WHO Tanzania"
  },
  {
    title: "Maternal Health Campaign Launches in Rural Areas",
    content: "The Ministry of Health has launched a nationwide maternal health campaign targeting rural communities. The initiative focuses on improving access to prenatal care and skilled birth attendance. Mobile health clinics are being deployed to remote areas to provide essential maternal health services. Community health workers are receiving training on emergency obstetric care and newborn health. The campaign aims to reduce maternal and infant mortality rates across Tanzania.",
    image: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800&h=600&fit=crop",
    category: "AFYA",
    day: "8",
    month: "July",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "The Citizen Tanzania"
  },
  {
    title: "Malaria Prevention Program Shows Promising Results",
    content: "Tanzania's malaria prevention program has shown significant progress with a 30% reduction in cases over the past year. The program includes distribution of insecticide-treated nets and indoor residual spraying. Community education campaigns have increased awareness about malaria prevention methods. Health facilities have improved diagnostic capabilities and treatment protocols. The government plans to expand successful interventions to achieve further reductions in malaria incidence nationwide.",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=600&fit=crop",
    category: "AFYA",
    day: "7",
    month: "July",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "Daily News Tanzania"
  },
  {
    title: "Mental Health Services Expansion Announced",
    content: "The government has announced plans to expand mental health services across all regions of Tanzania. New mental health units will be established in regional hospitals with trained psychiatrists and counselors. Community-based mental health programs will be introduced to reduce stigma and improve access to care. The initiative includes training for healthcare workers on mental health awareness and basic counseling skills. Investment in mental health infrastructure aims to address the growing need for psychological support services.",
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop",
    category: "AFYA",
    day: "5",
    month: "July",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "IPP Media"
  },

  // TEHAMA (Technology)
  {
    title: "Tanzania Launches Digital Identity System",
    content: "The government has officially launched a comprehensive digital identity system to modernize citizen services. The new system will enable online access to government services, reduce bureaucratic processes, and improve service delivery. Citizens can now apply for various documents and licenses through digital platforms. The initiative is part of Tanzania's broader digital transformation strategy. Enhanced security features protect personal data while facilitating seamless service access.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    category: "TEHAMA",
    day: "9",
    month: "July",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "The Citizen Tanzania"
  },
  {
    title: "Fiber Optic Cable Expansion Connects Rural Communities",
    content: "Tanzania's fiber optic infrastructure has been expanded to connect more rural communities to high-speed internet. The project aims to bridge the digital divide and enable access to online education and business opportunities. Local entrepreneurs are already leveraging improved connectivity for e-commerce and digital services. The expansion supports the government's goal of achieving universal internet access by 2030. Rural schools and health centers are among the primary beneficiaries of the enhanced connectivity.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop",
    category: "TEHAMA",
    day: "8",
    month: "July",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "Daily News Tanzania"
  },
  {
    title: "Mobile Money Platform Reaches 20 Million Users",
    content: "Tanzania's mobile money ecosystem has reached a milestone of 20 million active users, transforming financial inclusion across the country. The platform enables secure money transfers, bill payments, and access to microcredit services. Rural communities have particularly benefited from improved access to financial services. The growth has spurred innovation in digital financial products and services. Government initiatives supporting digital payments have accelerated adoption rates nationwide.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    category: "TEHAMA",
    day: "6",
    month: "July",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "IPP Media"
  },

  // AJIRA (Employment/Jobs)
  {
    title: "EACOP Scholarship Program Benefits 124 Tanzanian Students",
    content: "Through the EACOP and WASCO ISOAF Scholarship Program, 124 Tanzanian students have received full scholarships, demonstrating the company's commitment to community development. The program focuses on developing a skilled local workforce for Tanzania's expanding energy sector. Students are pursuing degrees in engineering, geology, and environmental sciences. The initiative creates pathways for youth employment in the oil and gas industry. Recipients are expected to contribute to Tanzania's energy sector development upon graduation.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    category: "AJIRA",
    day: "9",
    month: "July",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "IPP Media"
  },
  {
    title: "Youth Employment Program Creates 50,000 Jobs",
    content: "The government's youth employment program has successfully created 50,000 jobs across various sectors in the past year. The initiative focuses on skills training, entrepreneurship support, and job placement services. Young people have been engaged in agriculture, manufacturing, and service sectors. Microfinance support has enabled youth to start small businesses and become self-employed. The program aims to reduce youth unemployment and promote economic participation among young Tanzanians.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
    category: "AJIRA",
    day: "7",
    month: "July",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "The Citizen Tanzania"
  },
  {
    title: "Construction Sector Boom Creates Employment Opportunities",
    content: "Tanzania's construction sector is experiencing significant growth, creating thousands of employment opportunities across the country. Major infrastructure projects including roads, bridges, and buildings are driving job creation. Both skilled and unskilled workers are benefiting from increased construction activities. The sector is attracting foreign investment and creating demand for local materials and services. Training programs are being established to develop skilled construction workers to meet growing demand.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
    category: "AJIRA",
    day: "5",
    month: "July",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "Daily News Tanzania"
  },

  // BURUDANI (Entertainment)
  {
    title: "Swahili Cultural Festival Returns to Pemba Island",
    content: "Pemba Island is set to host the second edition of the Swahili Cultural Festival this August, celebrating the rich cultural heritage of the Swahili people. The festival will feature traditional music, dance performances, and cultural exhibitions. Local artists and performers from across East Africa will participate in the celebration. The event aims to promote cultural preservation and tourism in the region. Visitors will experience authentic Swahili culture through food, crafts, and storytelling sessions.",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
    category: "BURUDANI",
    day: "8",
    month: "July",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "Daily News Tanzania"
  },
  {
    title: "Bongo Flava Artists Dominate East African Music Charts",
    content: "Tanzanian Bongo Flava artists continue to dominate music charts across East Africa with their unique blend of hip-hop and traditional sounds. Several artists have achieved international recognition and collaborations with global musicians. The genre has become a cultural export, promoting Tanzanian music worldwide. Young artists are using digital platforms to reach wider audiences and build international fan bases. The success of Bongo Flava has contributed to Tanzania's growing creative economy.",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
    category: "BURUDANI",
    day: "6",
    month: "July",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "The Citizen Tanzania"
  },
  {
    title: "Film Festival Showcases Tanzanian Cinema",
    content: "The annual Tanzania Film Festival has showcased outstanding local productions, highlighting the growth of the country's film industry. Local filmmakers presented diverse stories reflecting Tanzanian culture and social issues. The festival provided a platform for emerging talent to connect with industry professionals. International film distributors showed interest in Tanzanian productions for global markets. The event emphasized the potential of creative industries to contribute to economic development.",
    image: "https://images.unsplash.com/photo-1489599162353-705d5e68c4d6?w=800&h=600&fit=crop",
    category: "BURUDANI",
    day: "4",
    month: "July",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "IPP Media"
  },

  // MICHEZO (Sports)
  {
    title: "Tanzania Prepares for CECAFA Women's Championship",
    content: "The Tanzania women's football team is intensifying preparations for the upcoming CECAFA Women's Championship. The team has been training at the National Stadium with focus on tactical improvements and physical conditioning. Coach emphasizes teamwork and strategic play to compete effectively against regional opponents. The tournament provides an opportunity for Tanzanian players to showcase their skills on the regional stage. Strong performance could boost women's football development in the country.",
    image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&h=600&fit=crop",
    category: "MICHEZO",
    day: "9",
    month: "July",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "Daily News Tanzania"
  },
  {
    title: "Kilimanjaro Marathon Attracts International Runners",
    content: "The annual Kilimanjaro Marathon has attracted over 2,000 international runners from 40 countries, boosting tourism and showcasing Tanzania's natural beauty. The challenging course offers stunning views of Mount Kilimanjaro and surrounding landscapes. Local athletes are competing alongside international participants in various race categories. The event promotes health and fitness while generating revenue for local communities. Marathon organizers emphasize environmental conservation and sustainable tourism practices.",
    image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=600&fit=crop",
    category: "MICHEZO",
    day: "7",
    month: "July",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "The Citizen Tanzania"
  },
  {
    title: "Boxing Champion Represents Tanzania at International Tournament",
    content: "Tanzania's boxing champion will represent the country at the upcoming international boxing tournament in South Africa. The boxer has been training intensively with international coaches to prepare for the competition. Success at the tournament could earn qualification for future Olympic competitions. The boxer's journey from local clubs to international recognition inspires young athletes across Tanzania. Government support for boxing development has contributed to improved performance standards.",
    image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&h=600&fit=crop",
    category: "MICHEZO",
    day: "5",
    month: "July",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "IPP Media"
  },
  {
    title: "Football Academy Develops Young Talent",
    content: "A new football academy in Dar es Salaam is developing young Tanzanian talent with modern training facilities and professional coaching. The academy focuses on technical skills development and character building for aspiring footballers. Several academy graduates have been recruited by professional clubs in Tanzania and abroad. The program includes education alongside football training to ensure well-rounded development. International partnerships provide exposure to global football standards and opportunities.",
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=600&fit=crop",
    category: "MICHEZO",
    day: "3",
    month: "July",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "Daily News Tanzania"
  }
];

async function seedArticles() {
  try {
    console.log('🌱 Starting to seed articles...');
    
    // Check if articles already exist to avoid duplicates
    const existingArticles = await prisma.article.findMany({
      where: {
        createdByBot: true
      }
    });

    if (existingArticles.length > 22) {
      console.log(`⚠️  Found ${existingArticles.length} existing bot-created articles. Skipping seeding.`);
      console.log('💡 If you want to re-seed, please delete existing articles first.');
      return;
    }

    // Create articles in batches
    const batchSize = 5;
    for (let i = 0; i < articles.length; i += batchSize) {
      const batch = articles.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(async (article) => {
          try {
            await prisma.article.create({
              data: {
                title: article.title,
                content: article.content,
                image: article.image,
                day: article.day,
                month: article.month,
                category: article.category,
                status: article.status,
                isPublic: article.isPublic,
                createdByBot: article.createdByBot,
                ArticleSource: article.ArticleSource,
                views: Math.floor(Math.random() * 1000) + 100, // Random views between 100-1100
                likes: Math.floor(Math.random() * 50) + 10, // Random likes between 10-60
              },
            });
            console.log(`✅ Created article: ${article.title}`);
          } catch (error) {
            console.error(`❌ Error creating article "${article.title}":`, error);
          }
        })
      );
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('🎉 Successfully seeded all articles!');
    
    // Display summary
    const summary = await prisma.article.groupBy({
      by: ['category'],
      _count: {
        category: true
      },
      where: {
        createdByBot: true
      }
    });

    console.log('\n📊 Articles created by category:');
    summary.forEach(item => {
      console.log(`   ${item.category}: ${item._count.category} articles`);
    });

  } catch (error) {
    console.error('❌ Error seeding articles:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
seedArticles()
  .catch((error) => {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  });