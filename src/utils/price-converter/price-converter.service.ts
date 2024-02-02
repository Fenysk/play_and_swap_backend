import { Injectable } from "@nestjs/common";

@Injectable()
export class PriceConverterService {

    convertToCents(price: number) {
        if (price < 0)
            return null;

        const convertedPrice = price * 100;

        return convertedPrice;
    }

}
