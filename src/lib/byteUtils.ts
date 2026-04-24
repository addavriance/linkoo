const encoder = new TextEncoder();
const decoder = new TextDecoder();

export class ByteWriter {
    private buf: number[] = [];

    u8(v: number) { this.buf.push(v & 0xff); }

    u16le(v: number) {
        this.buf.push(v & 0xff);
        this.buf.push((v >>> 8) & 0xff);
    }

    str(s: string) {
        const bytes = encoder.encode(s);
        this.u16le(bytes.length);
        for (const b of bytes) this.buf.push(b);
    }

    toUint8Array() { return new Uint8Array(this.buf); }
}

export class ByteReader {
    pos = 0;
    constructor(private data: Uint8Array) {}

    u8(): number {
        if (this.pos >= this.data.length) throw new Error('read past end');
        return this.data[this.pos++];
    }

    u16le(): number {
        const lo = this.u8();
        const hi = this.u8();
        return lo | (hi << 8);
    }

    str(): string {
        const len = this.u16le();
        const bytes = this.data.slice(this.pos, this.pos + len);
        this.pos += len;
        return decoder.decode(bytes);
    }
}
