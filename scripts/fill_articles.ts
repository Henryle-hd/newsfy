import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample articles based on authentic Tanzanian Swahili news sources
const articles = [
  // KIMATAIFA (International)
  {
    title: "Rais Samia amhudhuria mkutano wa viongozi wa Afrika Mashariki",
    content: "DAR ES SALAAM - Rais wa Jamhuri ya Muungano wa Tanzania, Samia Suluhu Hassan, amefika Geneva, Switzerland, kushuhudia mkutano wa viongozi wa Afrika Mashariki. Mkutano huu unalenga kujadili masuala ya ushirikiano wa kikanda na maendeleo ya uchumi. Rais Samia amesema Tanzania iko tayari kuongoza mchakato wa uongozi wa kanda ya Afrika Mashariki katika miaka ijayo. Mkutano huu umezungumzia pia masuala ya ufugaji wa amani na utulivu katika eneo la Afrika Mashariki. Viongozi wamelazimika kukubaliana kuhusu mipango ya pamoja ya kukabiliana na matatizo ya hali ya hewa.",
    image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&h=600&fit=crop",
    category: "KIMATAIFA",
    day: "9",
    month: "Julai",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "Mwananchi"
  },
  {
    title: "Ushirikiano wa kimataifa kuzindua mradi wa barabara mpya",
    content: "DODOMA - Serikali ya Tanzania imesaini mkataba wa kimataifa kuzindua mradi wa ujenzi wa barabara mpya itakayounganisha Tanzania na nchi jirani. Mradi huu utatekelezwa kwa ushirikiano wa Benki ya Dunia na mashirika mengine ya kimataifa. Waziri wa Uchukuzi amesema mradi huu utasaidia kuongeza biashara ya kimataifa na kuboresha mazingira ya kazi. Barabara hiyo itakuwa na urefu wa kilomita 450 na itaunganisha mikoa mingi ya nchi. Kazi ya ujenzi inaanza mwezi ujao na itachukua miaka miwili kukamilika.",
    image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=600&fit=crop",
    category: "KIMATAIFA",
    day: "8",
    month: "Julai",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "HabariLeo"
  },
  {
    title: "Wafuasi wa kidini kutoka nje ya nchi watembelea Tanzania",
    content: "MWANZA - Kikundi cha wafuasi wa kidini kutoka nchi mbalimbali za Afrika walifika Tanzania kwa ziara ya kijamii. Wafuasi hao walikuja kushiriki katika sherehe za kijamii na kujifunza utamaduni wa Kitanzania. Mkuu wa Mkoa wa Mwanza amewapokea wageni hao na kuwaahidi usalama wote. Wageni hao wametoa haba kwa jumuiya za kijamii na kutoa mzaha wa fedha kwa miradi ya kijamii. Ziara hii inaaminika itaongeza uhusiano wa kijamii kati ya Tanzania na nchi nyingine za Afrika.",
    image: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=800&h=600&fit=crop",
    category: "KIMATAIFA",
    day: "7",
    month: "Julai",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "Global Publishers"
  },
  {
    title: "Mkutano wa viongozi wa EAC kuhusu biashara ya kimataifa",
    content: "ARUSHA - Viongozi wa nchi za Jumuiya ya Afrika Mashariki (EAC) wamekutana Arusha kujadili masuala ya kuongeza biashara ya kimataifa. Mkutano huu umezungumzia jinsi ya kuondoa vikwazo vya biashara kati ya nchi za muungano. Rais Samia amewataka viongozi wengine kujitolea katika kuboresha mazingira ya biashara. Mkutano huu pia umejadili masuala ya hali ya hewa na athari zake kwa mazingira ya biashara. Viongozi wameahidi kutangaza hatua za pamoja za kuboresha biashara ndani ya wiki mbili zijazo.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
    category: "KIMATAIFA",
    day: "6",
    month: "Julai",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "Dar24"
  },

  // AFYA (Health)
  {
    title: "Serikali kutoa vifaa vya afya hospitali za umma",
    content: "DODOMA - Serikali ya Tanzania imepanga kutoa vifaa vya kisasa vya afya katika hospitali za umma nchini kote. Mradi huu una lengo la kuboresha huduma za afya kwa wananchi. Waziri wa Afya amesema vifaa hivyo vitasaidia kuongeza ubora wa matibabu katika hospitali za umma. Huduma hii itasaidia kuongeza imani ya wananchi kwa hospitali za umma. Vifaa hivi vitatolewa katika hospitali za kanda, wilaya na vijiji vya mbali. Utaratibu wa kusambaza vifaa hivi utaanza wiki ijayo na utakamilika ndani ya miezi mitatu.",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
    category: "AFYA",
    day: "9",
    month: "Julai",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "Mwananchi"
  },
  {
    title: "Kampeni ya chanjo dhidi ya malaria yaanza mikoa ya pwani",
    content: "DAR ES SALAAM - Wizara ya Afya imeanza kampeni ya chanjo za malaria katika mikoa ya pwani. Kampeni hii inalenga kuongeza kinga dhidi ya malaria kwa watoto na wazee. Daktari Mkuu wa Mkoa wa Dar es Salaam amesema chanjo hii ni salama na inafaa kwa kila mtu. Kampeni hii itasaidia kupunguza idadi ya watu wanaopatwa na malaria. Chanjo hii inatolewa bure katika vituo vyote vya afya vya umma. Wazazi wameombwa kuchukua watoto wao kuenda kupata chanjo hii muhimu.",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=600&fit=crop",
    category: "AFYA",
    day: "8",
    month: "Julai",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "HabariLeo"
  },
  {
    title: "Utafiti wa kifua kikuu unaanza hospitali za kanda",
    content: "MBEYA - Hospitali za kanda zimeanza utafiti wa kifua kikuu ili kuwasaidia wagonjwa walioathiriwa. Utafiti huu unafanywa na wataalamu kutoka chuo kikuu cha afya. Lengo ni kuongeza ufanisi wa matibabu ya kifua kikuu nchini. Waziri wa Afya amesema utafiti huu ni muhimu kwa kuongeza maisha ya wagonjwa. Hospitali za kanda zimepokea vifaa vya kisasa vya kufanya utafiti huu. Matokeo ya utafiti huu yatatumika kuboresha matibabu ya kifua kikuu nchini kote.",
    image: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800&h=600&fit=crop",
    category: "AFYA",
    day: "7",
    month: "Julai",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "Global Publishers"
  },
  {
    title: "Programu ya afya ya mama na mtoto yapanuliwa",
    content: "MWANZA - Programu ya kuboresha afya ya mama na mtoto imepanuliwa katika wilaya za vijijini. Programu hii inalenga kupunguza vifo vya mama na watoto wakati wa kujifungua. Waziri wa Afya amesema programu hii itasaidia kuongeza ustawi wa familia. Programu hii ina pamoja na mafunzo ya kina kwa mama wajawazito. Wauguzi wa kijiji wamepokea mafunzo maalumu ya kuwasaidia mama wajawazito. Programu hii inategemea kuongeza idadi ya mama wanaoenda kupata matibabu ya kina hospitalini.",
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop",
    category: "AFYA",
    day: "5",
    month: "Julai",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "Dar24"
  },

  // TEHAMA (Technology)
  {
    title: "Utumikaji wa teknolojia ya kisasa katika elimu yapanuliwa",
    content: "DODOMA - Serikali imepanua utumikaji wa teknolojia ya kisasa katika shule za msingi na sekondari nchini. Mradi huu utasaidia wanafunzi kujifunza kwa mbinu za kisasa. Waziri wa Elimu amesema teknolojia hii itasaidia kuboresha ubora wa elimu nchini. Kompyuta na vifaa vya kiteknolojia vitatolewa shule za umma. Walimu wamepokea mafunzo ya jinsi ya kutumia teknolojia hii katika kufundisha. Mradi huu utakamilika ndani ya miaka miwili na utafuatiliwa kwa karibu.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    category: "TEHAMA",
    day: "9",
    month: "Julai",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "Mwananchi"
  },
  {
    title: "Mitandao ya simu inaongeza kasi ya intaneti vijijini",
    content: "MTWARA - Makampuni ya mitandao ya simu yamepanua huduma zao za intaneti kwa kasi ya juu katika maeneo ya vijijini. Huduma hii itasaidia wafanyabiashara wadogo kuongeza biashara zao. Mkurugenzi wa kampuni moja ya simu amesema huduma hii ni muhimu kwa maendeleo. Vijiji vingi vimepata huduma ya intaneti kwa mara ya kwanza. Huduma hii itasaidia watoto wa vijijini kupata elimu ya mtandaoni. Makampuni hayo yamepanga kuongeza vituo vya huduma katika maeneo mengine ya vijijini.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop",
    category: "TEHAMA",
    day: "8",
    month: "Julai",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "HabariLeo"
  },
  {
    title: "Mfumo wa malipo ya kielektroniki umeongezeka matumizi",
    content: "DAR ES SALAAM - Mfumo wa malipo ya kielektroniki umeongezeka matumizi kwa asilimia 40 katika mwaka huu. Mfumo huu umesaidia kuongeza usalama wa fedha na kurahisisha biashara. Mkurugenzi wa Benki Kuu amesema mfumo huu ni muhimu kwa uchumi wa nchi. Wafanyabiashara wadogo wameanza kutumia mfumo huu kwa wingi. Mfumo huu umepunguza hatari za kuibiwa fedha na kurahisisha malipo. Serikali inapanga kuboresha zaidi mfumo huu kwa kuongeza usalama wake.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    category: "TEHAMA",
    day: "6",
    month: "Julai",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "Global Publishers"
  },

  // AJIRA (Employment/Jobs)
  {
    title: "Serikali kutoa nafasi za kazi elfu 20 kwa vijana",
    content: "DODOMA - Serikali ya Tanzania imetangaza kutoa nafasi za kazi elfu 20 kwa vijana wenye elimu ya juu. Nafasi hizi ni katika wizara mbalimbali za serikali na taasisi za umma. Waziri wa Utumishi wa Umma amesema nafasi hizi zitafungua maisha ya vijana wengi. Utaratibu wa kuomba kazi hizi utaanza wiki ijayo na utakamilika ndani ya mwezi mmoja. Vijana waliohitimu vyuo vikuu na vyuo vya ufundi wanaombwa kujiandaa. Maombi ya kazi hizi yanaweza kufanywa mtandaoni kupitia tovuti ya wizara.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    category: "AJIRA",
    day: "9",
    month: "Julai",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "Mwananchi"
  },
  {
    title: "Mradi wa ujenzi wa barabara kuongeza ajira kwa wananchi",
    content: "IRINGA - Mradi wa ujenzi wa barabara ya kilomita 150 umeanza na kuongeza ajira kwa wananchi wa eneo hilo. Mradi huu utasaidia kuongeza ajira za moja kwa moja kwa watu 5,000. Mkurugenzi wa mradi amesema wananchi wa eneo hilo watapata fursa ya kazi. Ajira hizi ni za muda mrefu na zitasaidia kuboresha hali ya maisha ya wananchi. Kazi za ujenzi zitachukua miaka miwili na nusu kwa kukamilika. Wafanyakazi wamepokea mafunzo maalumu ya usalama wakati wa kufanya kazi.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
    category: "AJIRA",
    day: "7",
    month: "Julai",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "HabariLeo"
  },
  {
    title: "Mafunzo ya ufundi kwa vijana yamepanuliwa mikoa mingine",
    content: "MBEYA - Programu ya mafunzo ya ufundi kwa vijana imepanuliwa katika mikoa mingine ya nchi. Programu hii inalenga kuwafundisha vijana stadi za kazi mbalimbali. Waziri wa Elimu na Ufundi amesema programu hii ni muhimu kwa kuongeza ujuzi wa vijana. Vijana watakaofaulu mafunzo hayo watapata vyeti vya kitaifa vya ufundi. Programu hii itasaidia vijana kujiajiri na kuongeza kipato chao. Mafunzo hayo yanajumuisha ufundi wa umeme, ujenzi, na mashine za viwandani.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
    category: "AJIRA",
    day: "5",
    month: "Julai",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "Dar24"
  },

  // BURUDANI (Entertainment)
  {
    title: "Msanii wa muziki wa Bongo Flava apata tuzo kimataifa",
    content: "DAR ES SALAAM - Msanii maarufu wa muziki wa Bongo Flava amepata tuzo muhimu ya kimataifa katika tamasha la muziki lililofanyika Afrika Kusini. Msanii huyu ameshinda tuzo ya 'Msanii Bora wa Muziki wa Kitamaduni' kwa mwaka huu. Tamasha hili limekuwa na washiriki kutoka Afrika nzima na linahusisha aina mbalimbali za muziki. Msanii huyu amesema ni furaha kubwa kuwakilisha Tanzania katika tamasha hili. Muziki wake umeenea kote Afrika na umepata upendo mkubwa wa mashabiki. Msanii huyu anatayarisha albamu mpya ambayo itatoka mwaka huu.",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
    category: "BURUDANI",
    day: "8",
    month: "Julai",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "Mwananchi"
  },
  {
    title: "Tamasha la utamaduni wa Kiswahili lafanyika Zanzibar",
    content: "ZANZIBAR - Tamasha la utamaduni wa Kiswahili limefanyika Zanzibar kwa kushiriki wasanii kutoka nchi za Afrika Mashariki. Tamasha hili linalenga kuhifadhi na kuendeleza utamaduni wa Kiswahili. Wasanii wamefanya maonyesho ya ngoma za jadi, mashairi, na michezo ya kitamaduni. Tamasha hili limevutia wageni wengi kutoka nchi za jirani na watalii wa kigeni. Makatibu wa Utamaduni Zanzibar amesema tamasha hili ni muhimu kwa kuhifadhi historia yetu. Tamasha hili linatarajia kuwa la kila mwaka ili kuendeleza utamaduni wa Kiswahili.",
    image: "https://images.unsplash.com/photo-1489599162353-705d5e68c4d6?w=800&h=600&fit=crop",
    category: "BURUDANI",
    day: "6",
    month: "Julai",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "Global Publishers"
  },
  {
    title: "Filamu ya Kitanzania yashinda tuzo za kimataifa",
    content: "DODOMA - Filamu ya Kitanzania imeibuka shujaa katika tamasha la filamu za Afrika lililo fanyika Kenya. Filamu hii inayohusisha masuala ya kijamii imepata sifa nzuri kutoka kwa waamuzi. Mkurugenzi wa filamu amesema ni mafanikio makubwa kwa sanaa ya filamu nchini. Filamu hii imesaidia kuonyesha ustadi wa watanzania katika sanaa ya filamu. Tuzo hii itasaidia kuongeza imani ya wafuasi wa filamu za Kitanzania. Filamu hii inatarajia kuonyeshwa katika sinema za kimataifa.",
    image: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&h=600&fit=crop",
    category: "BURUDANI",
    day: "4",
    month: "Julai",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "HabariLeo"
  },

  // MICHEZO (Sports)
  {
    title: "Timu ya mpira wa miguu ya Tanzania yajitayarisha mchuano mkuu",
    content: "DAR ES SALAAM - Timu ya taifa ya mpira wa miguu ya Tanzania inajitayarisha kwa mchuano mkuu wa kimataifa utakaofanyika wiki ijayo. Timu hii imepata mafunzo makali chini ya mkurugenzi mpya wa kigeni. Wachezaji wamepata mafunzo ya kina ya mikakati na mbinu za kucheza. Kocha mkuu amesema timu iko tayari kwa mchuano huu mkuu. Mashabiki wa mpira wa miguu wamepewa tiketi za bei nafuu kwa kushiriki mchuano huu. Timu hii inatarajia kufanya vizuri na kuibua sifa nzuri ya mpira wa miguu wa Tanzania.",
    image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&h=600&fit=crop",
    category: "MICHEZO",
    day: "9",
    month: "Julai",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "Mwananchi"
  },
  {
    title: "Mashindano ya riadha yamefanyika uwanda wa Taifa",
    content: "DAR ES SALAAM - Mashindano ya riadha yamefanyika uwanda wa Taifa kwa kushiriki wanariadha kutoka mikoa mbalimbali ya nchi. Mashindano hayo yamehusisha aina mbalimbali za riadha ikiwemo mbio, kuruka, na kutupa. Wanariadha wamefanya vizuri na kuonyesha ustadi wa hali ya juu. Mashindano hayo yamekuwa ni fursa ya kugundua talanta mpya za riadha. Mkurugenzi wa riadha amesema mashindano hayo ni muhimu kwa kuendeleza riadha nchini. Mashindano hayo yamemalizika kwa sherehe za kupongeza washindi.",
    image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=600&fit=crop",
    category: "MICHEZO",
    day: "7",
    month: "Julai",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "HabariLeo"
  },
  {
    title: "Mchezaji wa kandanda wa Tanzania ashinda tuzo ya kimataifa",
    content: "MWANZA - Mchezaji wa kandanda wa Tanzania ameshinda tuzo ya kimataifa katika mashindano ya Afrika yaliyofanyika Uganda. Mchezaji huyu ameshinda tuzo ya 'Mchezaji Bora wa Kike' kwa mwaka huu. Mchezaji huyu amekuwa akifanya vizuri katika mashindano ya kimataifa. Tuzo hii ni ya kwanza ya kimataifa kwa Tanzania katika mchezo wa kandanda. Mchezaji huyu amesema tuzo hii ni motisha kwa wachezaji wengine wa Tanzania. Serikali imepanga kumhudumia na kutoa msaada zaidi kwa riadha ya kandanda.",
    image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&h=600&fit=crop",
    category: "MICHEZO",
    day: "5",
    month: "Julai",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "Dar24"
  },
  {
    title: "Chuo cha riadha kitanzua mafunzo ya waongozaji wa michezo",
    content: "ARUSHA - Chuo cha riadha kimepanga kutanzua mafunzo ya waongozaji wa michezo mbalimbali ili kuboresha utawala wa riadha nchini. Mafunzo haya yatahusu masuala ya utawala, fedha, na maendeleo ya riadha. Mkurugenzi wa chuo amesema mafunzo haya ni muhimu kwa kuboresha mazingira ya riadha. Waongozaji wa vyama vya riadha wamealikwa kushiriki mafunzo hayo. Mafunzo hayo yataanza mwezi ujao na yatakuwa kwa wiki moja. Chuo hiki kimekuwa kikifanya mafunzo ya aina hii kwa miaka kadhaa na kumefanikisha wengi.",
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=600&fit=crop",
    category: "MICHEZO",
    day: "3",
    month: "Julai",
    status: "published",
    isPublic: true,
    createdByBot: true,
    ArticleSource: "Global Publishers"
  }
];

async function seedArticles() {
  try {
    console.log('🌱 Kuanza kuweka makala za habari za Kiswahili...');
    
    // Angalia kama makala zilizoundwa na bot tayari zipo
    const existingArticles = await prisma.article.findMany({
      where: {
        createdByBot: true
      }
    });

    if (existingArticles.length > 0) {
      console.log(`⚠️  Makala ${existingArticles.length} zilizoundwa na bot tayari zipo. Kuruka kuweka makala mpya.`);
      console.log('💡 Kama unataka kuweka makala mpya, futa makala za zamani kwanza.');
      return;
    }

    // Unda makala kwa vikundi
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
                views: Math.floor(Math.random() * 1000) + 100, // Maoni ya nasibu kati ya 100-1100
                likes: Math.floor(Math.random() * 50) + 10, // Mapendekezo ya nasibu kati ya 10-60
              },
            });
            console.log(`✅ Makala imeundwa: ${article.title}`);
          } catch (error) {
            console.error(`❌ Hitilafu ya kuunda makala "${article.title}":`, error);
          }
        })
      );
      
      // Subiri kidogo kati ya vikundi
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('🎉 Makala zote za habari za Kiswahili zimeundwa kwa mafanikio!');
    
    // Onyesha muhtasari
    const summary = await prisma.article.groupBy({
      by: ['category'],
      _count: {
        category: true
      },
      where: {
        createdByBot: true
      }
    });

    console.log('\n📊 Makala zilizoundwa kwa jamii:');
    summary.forEach(item => {
      console.log(`   ${item.category}: ${item._count.category} makala`);
    });

  } catch (error) {
    console.error('❌ Hitilafu ya kuweka makala:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Endesha kazi ya kuweka makala
seedArticles()
  .catch((error) => {
    console.error('💥 Kuweka makala kumeshindwa:', error);
    process.exit(1);
  });