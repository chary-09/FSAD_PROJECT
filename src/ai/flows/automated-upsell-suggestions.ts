'use server';
/**
 * @fileOverview A Genkit flow for suggesting room upgrades and additional services.
 *
 * - automatedUpsellSuggestions - A function that handles the process of suggesting upsells.
 * - AutomatedUpsellSuggestionsInput - The input type for the automatedUpsellSuggestions function.
 * - AutomatedUpsellSuggestionsOutput - The return type for the automatedUpsellSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomatedUpsellSuggestionsInputSchema = z.object({
  customerProfile: z.object({
    id: z.string().describe('Unique identifier for the customer.'),
    loyaltyTier: z.string().describe('The customer\u0027s loyalty program tier (e.g., Gold, Silver, None).'),
    previousStays: z.number().describe('The number of times the customer has stayed at the hotel previously.'),
    preferences: z.string().describe('A summary of customer preferences (e.g., \u0027quiet room\u0027, \u0027spa access\u0027).').optional(),
  }).describe('Details about the customer profile.'),
  bookingDetails: z.object({
    bookingId: z.string().describe('Unique identifier for the current booking.'),
    roomTypeBooked: z.string().describe('The type of room initially booked by the customer.'),
    numberOfNights: z.number().describe('The number of nights for the current booking.'),
    numberOfGuests: z.number().describe('The number of guests in the current booking.'),
    checkInDate: z.string().describe('The check-in date of the booking in ISO format (e.g., \u0027YYYY-MM-DD\u0027).'),
    totalPrice: z.number().describe('The total price of the initial booking.').optional(),
  }).describe('Details about the current booking.'),
  availableUpgrades: z.array(z.string()).describe('A list of room types available for upgrade.').optional(),
  availableServices: z.array(z.string()).describe('A list of additional services available (e.g., Spa Package, Breakfast Buffet).').optional(),
});
export type AutomatedUpsellSuggestionsInput = z.infer<typeof AutomatedUpsellSuggestionsInputSchema>;

const AutomatedUpsellSuggestionsOutputSchema = z.object({
  suggestedUpgrades: z.array(z.string()).describe('A list of suggested room upgrades.'),
  suggestedServices: z.array(z.string()).describe('A list of suggested additional services.'),
  reasoning: z.string().describe('A brief explanation for the generated suggestions.'),
});
export type AutomatedUpsellSuggestionsOutput = z.infer<typeof AutomatedUpsellSuggestionsOutputSchema>;

export async function automatedUpsellSuggestions(input: AutomatedUpsellSuggestionsInput): Promise<AutomatedUpsellSuggestionsOutput> {
  return automatedUpsellSuggestionsFlow(input);
}

const upsellSuggestionPrompt = ai.definePrompt({
  name: 'upsellSuggestionPrompt',
  input: {schema: AutomatedUpsellSuggestionsInputSchema},
  output: {schema: AutomatedUpsellSuggestionsOutputSchema},
  prompt: `You are an expert hotel upsell agent for Buildoholics Hotel Management System. Your goal is to suggest relevant room upgrades and additional services to a customer based on their profile and current booking details.\n\nConsider the following information:\n\nCustomer Profile:\n- Loyalty Tier: {{{customerProfile.loyaltyTier}}}\n- Previous Stays: {{{customerProfile.previousStays}}}\n- Preferences: {{{customerProfile.preferences}}}\n\nCurrent Booking Details:\n- Room Type Booked: {{{bookingDetails.roomTypeBooked}}}\n- Number of Nights: {{{bookingDetails.numberOfNights}}}\n- Number of Guests: {{{bookingDetails.numberOfGuests}}}\n- Check-in Date: {{{bookingDetails.checkInDate}}}\n\nAvailable Room Upgrades: {{#each availableUpgrades}}- {{{this}}}\n{{/each}}\n\nAvailable Additional Services: {{#each availableServices}}- {{{this}}}\n{{/each}}\n\nBased on this information, provide a list of suggested room upgrades and additional services that would be most appealing and beneficial to the customer. Explain your reasoning for each suggestion.\n\nEnsure the output is a valid JSON object matching the 'AutomatedUpsellSuggestionsOutputSchema' structure.`,
});

const automatedUpsellSuggestionsFlow = ai.defineFlow(
  {
    name: 'automatedUpsellSuggestionsFlow',
    inputSchema: AutomatedUpsellSuggestionsInputSchema,
    outputSchema: AutomatedUpsellSuggestionsOutputSchema,
  },
  async (input) => {
    const {output} = await upsellSuggestionPrompt(input);
    if (!output) {
      throw new Error('Failed to generate upsell suggestions.');
    }
    return output;
  }
);
