declare global {
    var ConnectionIds: {
        SellerConnectionIdOnFCS: string;
        BuyerConnectionIdOnFCS: string;
    };

    var AgentRootUrls: {
        BuyerAgentUrl: string;
        SellerAgentUrl: string;
        FcsAgentUrl: string;
        TicaretBakanligiAgentUrl: string;
    };

    var SchemaIds: {
        SellerIdentitySchemaId : string;
        DiscountTokenSchemaId : string;
        FeedbackTokenSchemaId : string;
    }

    var CredDefIds: {
        FeedbackTokenCredDefId : string;
        DiscountTokenCredDefId : string;
        SellerDigitalIdentityCredDefId : string;
    }
}
export { };