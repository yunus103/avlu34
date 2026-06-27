import { seoType } from "./objects/seo";
import { socialLinkType } from "./objects/socialLink";
import { customHtmlType } from "./objects/customHtml";
import { localizedStringType } from "./objects/localizedString";
import { localizedTextType } from "./objects/localizedText";
import { localizedBlockType } from "./objects/localizedBlock";
import { faqItem } from "./objects/faqItem";

import { siteSettingsType } from "./singletons/siteSettings";
import { navigationType } from "./singletons/navigation";
import { homePageType } from "./singletons/homePage";
import { aboutPageType } from "./singletons/aboutPage";
import { contactPageType } from "./singletons/contactPage";
import { cinemaPageType } from "./singletons/cinemaPage";
import { mallMapPageType } from "./singletons/mallMapPage";
import { visitPlanPageType } from "./singletons/visitPlanPage";
import { kvkkPageType } from "./singletons/kvkkPage";
import { storesPageType } from "./singletons/storesPage";
import { diningPageType } from "./singletons/diningPage";
import { campaignsPageType } from "./singletons/campaignsPage";
import { eventsPageType } from "./singletons/eventsPage";

import { storeCategoryType } from "./documents/storeCategory";
import { foodCategoryType } from "./documents/foodCategory";
import { storeType } from "./documents/store";
import { campaignType } from "./documents/campaign";
import { eventType } from "./documents/event";
import { heroSlideType } from "./documents/heroSlide";

export const schemaTypes = [
  // Objects
  seoType,
  socialLinkType,
  customHtmlType,
  localizedStringType,
  localizedTextType,
  localizedBlockType,
  faqItem,
  
  // Singletons
  siteSettingsType,
  navigationType,
  homePageType,
  aboutPageType,
  contactPageType,
  cinemaPageType,
  mallMapPageType,
  visitPlanPageType,
  kvkkPageType,
  storesPageType,
  diningPageType,
  campaignsPageType,
  eventsPageType,
  
  // Collections
  storeCategoryType,
  foodCategoryType,
  storeType,
  campaignType,
  eventType,
  heroSlideType,
];
