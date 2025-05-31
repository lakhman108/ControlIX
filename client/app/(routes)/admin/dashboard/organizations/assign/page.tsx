"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as Label from "@radix-ui/react-label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Test data
const testOrganizations = [
  { id: 1, name: "Acme Corp", description: "Technology Solutions" },
  { id: 2, name: "TechStart Inc", description: "Startup Solutions" },
  { id: 3, name: "Global Systems", description: "Enterprise Solutions" },
];

const testUsers = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
  { id: 3, name: "Bob Wilson", email: "bob@example.com" },
];

const assignmentFormSchema = z.object({
  organizationId: z.string().min(1, "Organization is required"),
  userId: z.string().min(1, "User is required"),
});

type FormData = z.infer<typeof assignmentFormSchema>;

export default function AssignOrganizationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orgSearch, setOrgSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [selectedOrg, setSelectedOrg] = useState<typeof testOrganizations[0] | null>(null);
  const [selectedUser, setSelectedUser] = useState<typeof testUsers[0] | null>(null);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(assignmentFormSchema),
    defaultValues: {
      organizationId: "",
      userId: "",
    },
  });

  const filteredOrgs = testOrganizations.filter(org =>
    org.name.toLowerCase().includes(orgSearch.toLowerCase())
  );

  const filteredUsers = testUsers.filter(user =>
    user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  async function onSubmit(values: FormData) {
    try {
      setIsSubmitting(true);
      console.log(values);
      // Add your API call here
      router.push("/admin/dashboard/organizations");
    } catch (error) {
      console.error("Error assigning organization:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/dashboard/organizations">
            <Button variant="ghost" className="p-2 rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <span className="text-sm text-gray-500">Back to Organizations</span>
        </div>
        <h1 className="text-3xl font-bold">Assign Organization</h1>
        <p className="text-gray-500 mt-1">Assign a user to an organization</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
        <div className="pb-4 mb-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Plus className="h-5 w-5 text-gray-600" />
            Assignment Details
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label.Root className="flex items-center gap-2 font-medium text-gray-700">
                <Building className="h-4 w-4 text-gray-500" />
                Organization
              </Label.Root>
              <div className="relative">
                <input
                  type="text"
                  value={orgSearch}
                  onChange={(e) => setOrgSearch(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-gray-600 focus:border-gray-600 focus:outline-none"
                  placeholder="Search organization..."
                />
                {orgSearch && filteredOrgs.length > 0 && !selectedOrg && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                    {filteredOrgs.map((org) => (
                      <div
                        key={org.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSelectedOrg(org);
                          setValue("organizationId", org.id.toString());
                          setOrgSearch(org.name);
                        }}
                      >
                        <div className="font-medium">{org.name}</div>
                        <div className="text-sm text-gray-500">{org.description}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.organizationId && (
                <p className="text-red-500 text-sm mt-1">{errors.organizationId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label.Root className="flex items-center gap-2 font-medium text-gray-700">
                <User className="h-4 w-4 text-gray-500" />
                User
              </Label.Root>
              <div className="relative">
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-gray-600 focus:border-gray-600 focus:outline-none"
                  placeholder="Search user..."
                />
                {userSearch && filteredUsers.length > 0 && !selectedUser && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSelectedUser(user);
                          setValue("userId", user.id.toString());
                          setUserSearch(user.name);
                        }}
                      >
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.userId && (
                <p className="text-red-500 text-sm mt-1">{errors.userId.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100 mt-8">
            <Link href="/dashboard/organizations">
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary text-white flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Assigning...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Assign Organization
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}