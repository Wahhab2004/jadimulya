import type { PotensiItem } from "@/lib/potensi-store";

// Generate & unduh PDF katalog potensi. jsPDF + jspdf-autotable di-import
// secara dinamis (bukan di top-level) supaya library PDF (lumayan besar)
// hanya dimuat saat tombol "Unduh Katalog" benar-benar diklik, bukan ikut
// membengkakkan bundle JS awal halaman katalog.
//
// Dependency yang perlu diinstal di project:
//   npm install jspdf jspdf-autotable

const VILLAGE_NAME = "Desa Jadimulya";
const FILE_NAME = "katalog-potensi-desa-jadimulya.pdf";

function truncate(text: string, maxLength: number) {
	const clean = text.trim().replace(/\s+/g, " ");
	if (clean.length <= maxLength) {
		return clean;
	}
	return `${clean.slice(0, maxLength - 1).trimEnd()}\u2026`;
}

export async function downloadPotensiCatalogPdf(items: PotensiItem[]) {
	if (typeof window === "undefined") {
		return;
	}

	const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
		import("jspdf"),
		import("jspdf-autotable"),
	]);

	const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
	const marginX = 40;
	const generatedAt = new Date().toLocaleDateString("id-ID", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});

	doc.setFont("helvetica", "bold");
	doc.setFontSize(16);
	doc.setTextColor(15, 23, 42);
	doc.text(`Katalog Potensi ${VILLAGE_NAME}`, marginX, 50);

	doc.setFont("helvetica", "normal");
	doc.setFontSize(10);
	doc.setTextColor(100, 116, 139);
	doc.text(
		`Diperbarui ${generatedAt} \u2022 Total ${items.length} potensi`,
		marginX,
		68,
	);

	autoTable(doc, {
		startY: 84,
		head: [["No", "Kategori", "Nama Potensi", "Status", "Deskripsi Singkat"]],
		body: items.map((item, index) => [
			String(index + 1),
			item.category,
			item.title,
			item.tag,
			truncate(item.description, 160),
		]),
		styles: { font: "helvetica", fontSize: 9, cellPadding: 6, valign: "top" },
		headStyles: { fillColor: [2, 132, 199], textColor: 255, fontStyle: "bold" },
		alternateRowStyles: { fillColor: [241, 245, 249] },
		columnStyles: {
			0: { cellWidth: 28, halign: "center" },
			1: { cellWidth: 80 },
			2: { cellWidth: 110, fontStyle: "bold" },
			3: { cellWidth: 55 },
			4: { cellWidth: "auto" },
		},
		margin: { left: marginX, right: marginX, bottom: 40 },
	});

	// Tambah footer nomor halaman setelah tabel selesai digambar seluruhnya,
	// supaya total halaman yang ditampilkan sudah pasti benar (bukan angka
	// sementara saat tabel masih berjalan ke halaman berikutnya).
	const totalPages = doc.getNumberOfPages();
	for (let page = 1; page <= totalPages; page += 1) {
		doc.setPage(page);
		doc.setFont("helvetica", "normal");
		doc.setFontSize(8);
		doc.setTextColor(148, 163, 184);
		doc.text(
			`Pemerintah ${VILLAGE_NAME} \u2022 Halaman ${page} dari ${totalPages}`,
			marginX,
			doc.internal.pageSize.getHeight() - 24,
		);
	}

	doc.save(FILE_NAME);
}
