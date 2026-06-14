export const esewaService = {
    initiatePayment: (params: {
        amount: number;
        bookingId: string;
    }) => {
        const { amount, bookingId } = params;

        const form = document.createElement("form");

        form.method = "POST";
        form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

        const fields = {
            amount,
            tax_amount: 0,
            total_amount: amount,
            transaction_uuid: bookingId,
            product_code: "EPAYTEST",

            success_url: `${window.location.origin}/payment/success`,
            failure_url: `${window.location.origin}/payment/failure`,

            signed_field_names: "total_amount,transaction_uuid,product_code",
            signature: "TEST_SIGNATURE", // we fix this below
        };

        Object.entries(fields).forEach(([key, value]) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = String(value);
            form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
    },
};