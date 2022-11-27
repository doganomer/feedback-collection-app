export class PresentProofModel {
    results: PresentProofResultModel[] = [];
    
}

export class PresentProofResultModel {
    presentation_exchange_id: string = '';
    role: string = '';
    auto_present: boolean = false;
    connection_id: string = '';
    initiator: string = '';
    state: string = '';
    thread_id: string = '';
    created_at: string = '';
    updated_at: string = '';
    verified: string = '';
    presentation: PresentProofPresentationModel;
    presentation_request: any;
}

export class PresentProofPresentationModel {
    identifiers: PresentProofIdentifier[] = [];
}

export class PresentProofIdentifier {
    schema_id: string = '';
    cred_def_id: string = '';
}
