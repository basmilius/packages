import { SRP, SrpClient } from 'fast-srp-hap';
import tweetnacl from 'tweetnacl';

export default class HapSrpClient {
    readonly #privateKey: Uint8Array;
    readonly #publicKey: Uint8Array;
    readonly #signingKey: Uint8Array;
    readonly #verifyPrivateKey: Uint8Array;
    readonly #verifyPublicKey: Uint8Array;
    #pin?: Buffer;
    #srp?: SrpClient;

    constructor() {
        const pair = tweetnacl.sign.keyPair();
        this.#privateKey = Buffer.from(pair.secretKey);
        this.#publicKey = Buffer.from(pair.publicKey);

        const pair2 = tweetnacl.sign.keyPair();
        this.#verifyPrivateKey = Buffer.from(pair2.secretKey);
        this.#verifyPublicKey = Buffer.from(pair2.publicKey);
    }

    step1(pin: string): void {
        this.#pin = Buffer.from(pin);
    }

    async step2(serverPublicKey: Buffer, serverSalt: Buffer): Promise<Step2> {
        this.#srp = new SrpClient(SRP.params.hap, serverSalt, Buffer.from('Pair-Setup'), this.#pin, Buffer.from(this.#privateKey));
        this.#srp.setB(serverPublicKey);

        return {
            publicKey: this.#srp.computeA(),
            proof: this.#srp.computeM1()
        };
    }
}

type Step2 = {
    readonly publicKey: Buffer;
    readonly proof: Buffer;
};
