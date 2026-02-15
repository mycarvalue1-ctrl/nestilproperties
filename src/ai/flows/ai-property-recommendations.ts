'use server';
/**
 * @fileOverview A Genkit flow that suggests similar properties based on a viewed property and user preferences.
 *
 * - aiPropertyRecommendations - A function that handles the property recommendation process.
 * - AiPropertyRecommendationsInput - The input type for the aiPropertyRecommendations function.
 * - AiPropertyRecommendationsOutput - The return type for the aiPropertyRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiPropertyRecommendationsInputSchema = z.object({
  viewedProperty: z.object({
    id: z.string().describe('Unique identifier of the viewed property.'),
    title: z.string().describe('Title of the viewed property.'),
    type: z.enum(['rent', 'sale', 'lease']).describe('Type of listing: rent, sale, or lease.'),
    propertyType: z.enum(['house', 'flat', 'land', 'commercial']).describe('Type of property: house, flat, land, or commercial.'),
    price: z.number().describe('Price of the viewed property.'),
    areaSqFt: z.number().describe('Area of the viewed property in square feet.'),
    address: z.string().describe('Full address of the viewed property.'),
    description: z.string().describe('Detailed description of the viewed property.'),
    bhk: z.string().optional().describe('BHK configuration (e.g., "2BHK", "3BHK").'),
    furnishing: z.enum(['furnished', 'semi-furnished', 'unfurnished']).optional().describe('Furnishing status.'),
    amenities: z.array(z.string()).optional().describe('List of amenities available in the viewed property.'),
  }).describe('Details of the property the user has just viewed.'),
  userPreferences: z.object({
    minPrice: z.number().nullable().optional().describe('Minimum preferred price.'),
    maxPrice: z.number().nullable().optional().describe('Maximum preferred price.'),
    preferredLocations: z.array(z.string()).optional().describe('List of preferred locations/areas.'),
    preferredBHKs: z.array(z.string()).optional().describe('List of preferred BHK configurations (e.g., "2BHK").'),
    desiredAmenities: z.array(z.string()).optional().describe('List of desired amenities.'),
  }).describe('Explicit preferences provided by the user.')
});
export type AiPropertyRecommendationsInput = z.infer<typeof AiPropertyRecommendationsInputSchema>;

const AiPropertyRecommendationsOutputSchema = z.object({
  recommendedProperties: z.array(z.object({
    id: z.string().describe('Unique identifier of the recommended property.'),
    title: z.string().describe('Title of the recommended property.'),
    price: z.number().describe('Price of the recommended property.'),
    location: z.string().describe('A concise location string for the recommended property (e.g., "Downtown, City").'),
    relevanceScore: z.number().min(0).max(100).describe('A score (0-100) indicating how relevant this property is based on the input preferences.'),
    reason: z.string().describe('A brief explanation why this property is recommended, highlighting key matching features.'),
  })).describe('An array of recommended properties.')
});
export type AiPropertyRecommendationsOutput = z.infer<typeof AiPropertyRecommendationsOutputSchema>;

export async function aiPropertyRecommendations(input: AiPropertyRecommendationsInput): Promise<AiPropertyRecommendationsOutput> {
  return aiPropertyRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPropertyRecommendationsPrompt',
  input: {schema: AiPropertyRecommendationsInputSchema},
  output: {schema: AiPropertyRecommendationsOutputSchema},
  prompt: `You are an intelligent real estate agent specializing in property matching.\nYour task is to recommend similar properties based on a property the user has recently viewed and their explicit preferences.\nThe recommendations should be highly relevant and diverse, covering different aspects of similarity (e.g., price, location, property type, amenities).\n\nHere is the property the user just viewed:\nProperty ID: {{{viewedProperty.id}}}\nTitle: {{{viewedProperty.title}}}\nType: {{{viewedProperty.type}}}\nProperty Type: {{{viewedProperty.propertyType}}}\nPrice: {{{viewedProperty.price}}}\nArea: {{{viewedProperty.areaSqFt}}} sq ft\nAddress: {{{viewedProperty.address}}}\nDescription: {{{viewedProperty.description}}}\n{{#if viewedProperty.bhk}}BHK: {{{viewedProperty.bhk}}}{{/if}}\n{{#if viewedProperty.furnishing}}Furnishing: {{{viewedProperty.furnishing}}}{{/if}}\n{{#if viewedProperty.amenities}}Amenities: {{#each viewedProperty.amenities}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}\n\nHere are the user's explicit preferences:\n{{#if userPreferences.minPrice}}Minimum Price: {{{userPreferences.minPrice}}}{{/if}}\n{{#if userPreferences.maxPrice}}Maximum Price: {{{userPreferences.maxPrice}}}{{/if}}\n{{#if userPreferences.preferredLocations}}Preferred Locations: {{#each userPreferences.preferredLocations}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}\n{{#if userPreferences.preferredBHKs}}Preferred BHKs: {{#each userPreferences.preferredBHKs}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}\n{{#if userPreferences.desiredAmenities}}Desired Amenities: {{#each userPreferences.desiredAmenities}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}\n\nBased on this information, generate an array of 3 to 5 highly relevant property recommendations.\nFor each recommended property, provide a unique ID, a descriptive title, its price, a concise location, a relevance score from 0-100, and a brief reason for the recommendation.\nEnsure the recommendations meet the user's explicit preferences as much as possible, while also finding properties similar to the viewed one.\nDo not assume any additional properties beyond the given input. Invent plausible property details that fit the criteria.\nEach recommended property object must conform to the following JSON structure:\n{{json-schema AiPropertyRecommendationsOutputSchema}}\n`,
});

const aiPropertyRecommendationsFlow = ai.defineFlow(
  {
    name: 'aiPropertyRecommendationsFlow',
    inputSchema: AiPropertyRecommendationsInputSchema,
    outputSchema: AiPropertyRecommendationsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
