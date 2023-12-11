export const format = (value: number) => {
    const formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return formatter.format(value); //Rp.???.???.00
}