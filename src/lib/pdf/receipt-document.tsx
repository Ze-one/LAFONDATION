import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 22,
    marginBottom: 8,
    fontFamily: "Helvetica-Bold",
  },
  subtitle: {
    fontSize: 10,
    color: "#666",
    marginBottom: 24,
  },
  section: { marginBottom: 16 },
  label: { fontSize: 9, color: "#666", marginBottom: 2 },
  value: { fontSize: 11, marginBottom: 8 },
  txn: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    padding: 12,
    backgroundColor: "#f4f4f5",
    borderRadius: 4,
  },
  footer: {
    position: "absolute",
    bottom: 32,
    left: 40,
    right: 40,
    fontSize: 8,
    color: "#999",
  },
});

export type ReceiptPdfProps = {
  transactionId: string;
  fullName: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string;
  issuedAt: string;
};

export function ReceiptDocument(props: ReceiptPdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>LAFONDATION Receipt</Text>
        <Text style={styles.subtitle}>FECAF00T — Registration confirmation</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Transaction ID</Text>
          <Text style={styles.txn}>{props.transactionId}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Full name</Text>
          <Text style={styles.value}>{props.fullName}</Text>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{props.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Address</Text>
          <Text style={styles.value}>{props.addressLine1}</Text>
          {props.addressLine2 ? (
            <Text style={styles.value}>{props.addressLine2}</Text>
          ) : null}
          <Text style={styles.value}>
            {props.postalCode} {props.city}
          </Text>
          <Text style={styles.value}>{props.country}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Issued</Text>
          <Text style={styles.value}>{props.issuedAt}</Text>
        </View>

        <Text style={styles.footer}>
          Financial details are stored encrypted and do not appear on this receipt.
          Keep this document for your records.
        </Text>
      </Page>
    </Document>
  );
}
