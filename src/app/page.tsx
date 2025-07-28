import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AquaData } from "@/type/aquaData";

// Halaman ini adalah Server Component, jadi kita bisa langsung 'async'
export default async function AquaDataPage() {
  const cookieStore = cookies();
  // Buat client Supabase untuk diakses dari sisi server
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Ambil data dari tabel 'data_aqua'
  // Kita urutkan berdasarkan 'terminaltime' terbaru dan batasi 10 data
  const { data: aquaData, error } = await supabase
    .from("data_aqua")
    .select("*")
    .order("terminaltime", { ascending: false })
    .limit(10); // Mengambil 10 data terakhir

  // Penanganan jika terjadi error saat mengambil data
  if (error) {
    console.error("Error fetching data:", error);
    return (
      <p className="p-8 text-red-500">Gagal memuat data. Silakan coba lagi.</p>
    );
  }

  // Penanganan jika tidak ada data yang ditemukan
  if (!aquaData || aquaData.length === 0) {
    return <p className="p-8">Tidak ada data yang ditemukan.</p>;
  } else {
    console.log(aquaData);
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Monitoring Data Aqua</h1>
        <form action="/auth/signout" method="post">
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Sign Out
          </button>
        </form>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border-b">Waktu</th>
              <th className="py-2 px-4 border-b">Grup</th>
              <th className="py-2 px-4 border-b">Temperatur</th>
              <th className="py-2 px-4 border-b">Ozon</th>
              <th className="py-2 px-4 border-b">Oksigen</th>
              <th className="py-2 px-4 border-b">TDS</th>
            </tr>
          </thead>
          <tbody>
            {aquaData.map((data: AquaData) => (
              <tr key={data.id} className="hover:bg-gray-50 text-center">
                <td className="py-2 px-4 border-b">
                  {new Date(data.terminaltime).toLocaleString("id-ID")}
                </td>
                <td className="py-2 px-4 border-b">{data.groupname}</td>
                <td className="py-2 px-4 border-b">{data.temperature}°C</td>
                <td className="py-2 px-4 border-b">{data.ozone}</td>
                <td className="py-2 px-4 border-b">{data.oxygen}</td>
                <td className="py-2 px-4 border-b">{data.tds}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
